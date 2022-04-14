import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { GameService } from './game.service';

export interface Database { name: string; }
export interface DatabaseWithId extends Database { id: string; }

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private readonly db: AngularFirestore,
    private gameService: GameService
  ) { }

  getDatabase(tournamentId: string, databaseId: string): Observable<Database> {
    const collection = this.getDatabaseCollection(tournamentId);
    return collection.doc<Database>(databaseId).get().pipe(
      map(snapshot => snapshot.data() as Database));
  }

  getDatabases(tournamentId: string): Observable<DatabaseWithId[]> {
    return this.getDatabaseCollection(tournamentId).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Database;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  uploadPgn(tournamentId: string, filename: string, pgn: string) {
    this.createDatabase(tournamentId, filename).then(databaseId => {
      this.gameService.addGames(tournamentId, databaseId, pgn);
    });
  }

  private createDatabase(tournamentId: string, name: string): Promise<string> {
    const databases = this.getDatabaseCollection(tournamentId);
    return databases.add({name: name}).then(ref => ref.id);
  }

  private getDatabaseCollection(tournamentId: string): AngularFirestoreCollection<Database> {
    return this.db.collection<Database>('tournaments/' + tournamentId + '/databases');
  }
}

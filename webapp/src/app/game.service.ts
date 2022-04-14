import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Game { pgn: string; databaseId: string; trainingDataExported?: number }
export interface GameExt extends Game { id: string; headers }

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private readonly db: AngularFirestore) { }

  /** Returns all games. Can filter by database ID. */
  getGames(tournamentId: string, databaseId?: string): Observable<GameExt[]> {
    const query = this.db.collection<Game>(
      this.getGameCollectionPath(tournamentId),
      databaseId && (ref => ref.where('databaseId', '==', databaseId)));
    return query.snapshotChanges().pipe(
      map(actions => actions.map(a => this.getGameExt(a.payload.doc))));
  }

  /** Returns a specific game. */
  getGame(tournamentId: string, gameId: string): Observable<GameExt> {
    const collection = this.getGameCollection(tournamentId);
    return collection.doc<Game>(gameId).get().pipe(
      map(snapshot => this.getGameExt(snapshot)));
  }

  addGames(tournamentId: string, databaseId: string, pgn: string) {
    const gameCollection = this.getGameCollection(tournamentId);
    pgn.split(/\n\r?\n\r?(?=\[)/).forEach(gamePgn => {
      gameCollection.add({pgn: gamePgn, databaseId: databaseId});
    });
  }

  setGameAsExported(tournamentId: string, gameId: string, version: number) {
    const collection = this.getGameCollection(tournamentId);
    return collection.doc<Game>(gameId).update({trainingDataExported: version});
  }

  private extractPgnHeaders(pgn: string) {
    var regex = /\[([A-Z][a-z]+) \"(.+)\"\]/gi, match, result = {};
    while (match = regex.exec(pgn)) {
      result[match[1]] = match[2];
    }
    return result;
  }

  private getGameExt(gameDoc: any): GameExt {
    const data = gameDoc.data() as Game;
    const id = gameDoc.id;
    const headers = this.extractPgnHeaders(data.pgn);
    return { id, headers, ...data };
  }

  private getGameCollection(tournamentId: string): AngularFirestoreCollection<Game> {
    return this.db.collection<Game>(this.getGameCollectionPath(tournamentId));
  }

  private getGameCollectionPath(tournamentId: string): string {
    return 'tournaments/' + tournamentId + '/games';
  }
}

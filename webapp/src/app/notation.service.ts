import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Notation { 
  id?: string;
  pictureId: string;
  pictureRotation?: number;  // TODO: Mark as required.
  gameId?: string;
  grid: any;
  pageNumber: number;
  language: string;
  corrections: any;
  writer?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotationService {

  constructor(private readonly db: AngularFirestore) { }
  
  /** Returns all notations associated with the given picture. */
  getNotations(tournamentId: string, pictureId?: string): Observable<Notation[]> {
    const query = this.db.collection<Notation>(
      this.getNotationCollectionPath(tournamentId),
      ref => pictureId ? ref.where('pictureId', '==', pictureId) : ref);
    return query.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Notation;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }

  // TODO: implement a more generic method that allows to specify the where clause
  getNotationsForGame(tournamentId: string, gameId: string): Observable<Notation[]> {
    const query = this.db.collection<Notation>(
      this.getNotationCollectionPath(tournamentId),
      ref => ref.where('gameId', '==', gameId));
    return query.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Notation;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
  }
    
  
  /**
   * Saves the given notations. If the notation document already exists, it will be updated.
   * Otherwise, it will be added to the notation collection.
   */
  createOrUpdateNotation(tournamentId: string, notation: Notation) {
    localStorage.lastNotationGrid = JSON.stringify(notation.grid);
    if (notation.id) {
      const notationDoc = this.db.doc<Notation>(
        this.getNotationCollectionPath(tournamentId) + '/' + notation.id);
      notationDoc.update(notation);
    } else {
      const collection = this.db.collection<Notation>(
        this.getNotationCollectionPath(tournamentId));
      collection.add(notation);
    }
  }

  /** Creates a new (unsaved) notation object that can be passed to the saveNotations. */
  newNotation(pictureId: string, language: string): Notation {
    var lastGrid = localStorage.lastNotationGrid && JSON.parse(localStorage.lastNotationGrid);
    if (lastGrid) lastGrid.positionedRows = {};  // Don't reuse row positioning.
    return {
      pictureId: pictureId,
      grid: lastGrid || {
        type: "v1",
        rows: 20,
        columns: 3,
        columnSpacing: 0.05,
        outline: {
          topLeft: [0.09, 0.28],
          topRight: [0.98, 0.28],
          bottomRight: [0.98, 0.96],
          bottomLeft: [0.09, 0.96],
        },
        positionedRows: {}
      },
      pageNumber: 1,
      language: language,
      corrections: {}
    } as Notation;
  }

  /** Sets the writer name (used for trainingdata only). */
  setWriter(tournamentId: string, notationId: string, writer: string) {
    const ref = this.db.doc<Notation>(this.getNotationCollectionPath(tournamentId) + '/' + notationId);
    ref.update({writer} as Partial<Notation>);
  }

  private getNotationCollectionPath(tournamentId: string): string {
    return 'tournaments/' + tournamentId + '/notations';
  }
}

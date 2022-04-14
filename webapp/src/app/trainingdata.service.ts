import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, first, map, switchMap, take } from 'rxjs/operators';
import * as Chess from 'chess.js';

import { GameService } from './game.service';
import { PictureService } from './picture.service';
import { Notation } from './notation.service';
import { NotationCanvas } from '../lib/notation-canvas.js';

export interface Trainingdata {
  filename: string;
  pictureId: string;
  halfmove: number;
  language: string;
  version: number;
  labels: string[];
}

// TODO: Upgrade to latest TypeScript to get OffscreenCanvas declaraction.
declare var OffscreenCanvas: any;

// The version of training data. Increase to ignore older training data.
const VERSION = 2;

@Injectable({
  providedIn: 'root'
})
// DEPRECATED - will be removed soon.
export class TrainingdataService {

  constructor(
    private readonly gameService: GameService,
    private readonly pictureService: PictureService,
    private readonly storage: AngularFireStorage,
    private readonly db: AngularFirestore
  ) { }

  exportTrainingCsv() {
    const collection = this.db.collection<Trainingdata>('trainingdata');
    collection.valueChanges().pipe(take(1)).subscribe(moves => {
      moves = moves.filter(move => move.version == VERSION);
      // Only use label rows for now.
      for (let move of moves) {
      //  move.labels = move.labels.filter(label => !label.startsWith('O'));
      }
      moves = moves.filter(move => move.labels.length > 0);
      const csvRows = moves.map(move => 'gs://quickchess-7300e-vcm/training/moves/' + move.filename + ',' + move.labels.join(','));
      const unique = new Set(csvRows);
      let uniqueArray = Array.from(unique.values());
      uniqueArray.sort();
      console.log(uniqueArray.join('\n'));
    })
  }

  exportTrainingData(tournamentId: string, notation: Notation, gameId: string) {
    this.gameService.getGame(tournamentId, gameId).pipe(first()).subscribe(game => {
      this.pictureService.downloadPicture(notation.pictureId).subscribe(img => {
        img.onload = () => {
          let offscreenCanvas: any = new OffscreenCanvas(350, 150);
          const canvas = new NotationCanvas(offscreenCanvas);
          canvas.showGrid = false;
          canvas.notations = [notation];
          canvas.rotation = notation.pictureRotation || 0;
          canvas.image = img;
          this.generateTrainingData(game.pgn, notation, canvas);
        };
      });
    });
  }

  private generateTrainingData(pgn: string, notation: Notation, canvas: NotationCanvas) {
    const moves = this.createTrainingDataObjects(pgn, notation.language, notation.pictureId);
    for (let move of moves) {
      console.log("Exporting move ", move);
      canvas.zoomToMove(0, move.halfmove);
      canvas.onResize();
      canvas.draw();
      canvas.canvas.convertToBlob().then(blob => {
        console.log("Move image blob received", move.halfmove);
        this.storeTrainingdata(move, blob);
      });
    }
  }

  /** Given a game as pgn, creates the Trainingdata objects by classifying each move. */
  private createTrainingDataObjects(pgn: string, language: string, pictureId: string): Trainingdata[] {
    var chess = new Chess();
    if (!chess.load_pgn(pgn.trim())) {
      console.log('Error parsing pgn', pgn);
      return [];
    }
    return chess.history({verbose: true}).map((move, index) => {
      return {
        filename: pictureId + '-' + index + '.png',
        pictureId: pictureId,
        halfmove: index,
        language: language,
        version: VERSION,
        labels: this.classifyMove(move)
      };
    });
  }

  /** Given a chess.js move, returns the desired classification for the three neural nets. */
  private classifyMove(move: any): string[] {
    if (move.san == 'O-O' || move.san == 'O-O-O') {
      return [move.san];
    }
    var labels = ['piece-' + move.piece, 'file-' + move.to[0], 'row-' + move.to[1]];
    if (move.flags == 'c' || move.flags == 'e') {
      labels.push('capture');
    }
    return labels;
  }
  
  private storeTrainingdata(data: Trainingdata, blob: Blob) {
    const ref = this.storage.ref('training/moves/' + data.filename);
    const task = ref.put(blob, {contentType: 'image/png'});
    
    task.snapshotChanges().pipe(
      finalize(() => {
        console.log("Move image upload finished", data.halfmove);
        const collection = this.db.collection<Trainingdata>('trainingdata');
        collection.add(data);
      })
    ).subscribe()
  }
}

import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { finalize, first, map, switchMap, take } from 'rxjs/operators';
import * as sha1 from 'js-sha1';
import * as Chess from 'chess.js';

import { NotationCanvas } from '../../../lib/notation-canvas.js';
import { NotationcanvasComponent } from '../../notationcanvas/notationcanvas.component';
import { GameExt, GameService } from '../../game.service';
import { NotationService, Notation } from '../../notation.service';
import { NotationdialogComponent } from '../../notationdialog/notationdialog.component';
import { PictureService, PictureWithId } from '../../picture.service';

const TRANING_DATA_VERSION = 2;
const DEFAULT_QUALITY = 100;

@Component({
  selector: 'app-exportmoves',
  templateUrl: './exportmoves.component.html',
  styleUrls: ['./exportmoves.component.css']
})
export class ExportmovesComponent implements AfterContentChecked, OnInit {
  games?: GameExt[];
  game: any;
  needCanvasUpdate: boolean;
  notations: Notation[];

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private notationService: NotationService,
    private pictureService: PictureService,
    private readonly storage: AngularFireStorage,
    private readonly db: AngularFirestore,
    private dialog: MatDialog
  ) {
    this.games = null;
    this.game = null;
    this.needCanvasUpdate = false;
    this.notations = [];
  }

  ngOnInit() {
    this.gameService.getGames(this.tournamentId).pipe(take(1)).subscribe(games => {
      console.log('All games:', games.length);
      games = games.filter(game => !game.trainingDataExported || game.trainingDataExported < TRANING_DATA_VERSION);
      console.log('Games not exported yet:', games.length);
      this.games = games;
      this.findNextGame();
    });
  }

  findNextGame() {
    if (this.games.length == 0) {
      console.log("No more games to export");
      return;
    }
    let game = this.games.pop();
    let found = false;
    this.notationService.getNotationsForGame(this.tournamentId, game.id).pipe(take(1)).subscribe(notations => {
      if (found) return;
      if (notations.length > 0) {
        found = true;
        this.generateTrainingData(game, notations);
        console.log('Games left to process:', this.games.length);
      } else {
        if (!found) this.findNextGame();
      }
    });
  }
  
  private generateTrainingData(game: GameExt, notations: Notation[]) {
    if (this.game && this.game.gameId == game.id) return;
    let moves = this.getMoves(game.pgn).slice(0, 120);
    this.game = {
      gameId: game.id,
      moves,
      notations: notations.map(notation => {
        return {
          notationId: notation.id,
          pictureId: notation.pictureId,
          language: notation.language,
          writer: sha1('jnen5soe32nga_ermawme' + this.tournamentId + notation.writer),
          moveImages: moves.map((move, index) => {
            //let paddedMoveNumber = `00${index}`.slice(-3);
            return {
              // filename: game.id + '-' + notation.pictureId + '-' + paddedMoveNumber + '.png',
              quality: DEFAULT_QUALITY
            };
          })
        };
      })
    };
    this.notations = notations;
    this.needCanvasUpdate = true;
    console.log("New game:", this.game);
  }

  private getMoves(pgn: string) {
    var chess = new Chess();
    if (!chess.load_pgn(pgn.trim(), {sloppy: true})) {
      console.log('Error parsing pgn', pgn);
      return [];
    }
    return chess.history();
  }

  ngAfterContentChecked() {
    if (this.needCanvasUpdate) {
      this.needCanvasUpdate = false;
      this.notations.forEach((notation, notationIndex) => {
        this.pictureService.downloadPicture(notation.pictureId).subscribe(img => {
          img.onload = () => {
            this.updateCanvases(notation, notationIndex, img);
          }
        });
      });
    }
  }
  
  private updateCanvases(notation: Notation, notationIndex: number, notationPicture: any) {
    for (let moveIndex = 0; moveIndex < this.game.moves.length; moveIndex++) {
      let elem = document.getElementById("movecanvas-" + notationIndex + '-' + moveIndex);
      let canvas = new NotationCanvas(elem);
      canvas.notations = [notation];
      canvas.showGrid = false;
      // TODO: Reconsider this auto-rotation logic once we allow two notations on one picture.
      // TODO: Might be a good idea not to support two notations per picture, so consider moving this into Canvas class.
      if (typeof notation.pictureRotation == 'number') {
        canvas.rotation = notation.pictureRotation;
      } else {
        canvas.rotation = notationPicture.width > notationPicture.height ? 90 : 0;
      }
      canvas.image = notationPicture;
      canvas.zoomToMove(0, moveIndex);
    }
  }

  export(dataset: string) {
    let game = this.game;
    let count = this.notations.length * this.game.moves.length;
    let blobs = 0;
    let blobsUploaded = 0;
    this.notations.forEach((notation, notationIndex) => {
      for (let moveIndex = 0; moveIndex < this.game.moves.length; moveIndex++) {
        let canvas = document.getElementById("movecanvas-" + notationIndex + '-' + moveIndex) as HTMLCanvasElement;
        canvas.toBlob(blob => {
          blobs++;
          console.log(`Blobs received ${blobs}/${count}`);
          if (blobs == count) {
            // Canvas elements are no longer needed... 
            this.findNextGame(); 
          }
          
          let filename = notation.gameId + '-' + notation.pictureId + '-' + `00${moveIndex}`.slice(-3) + '.png';
          const ref = this.storage.ref('training/moves-v' + TRANING_DATA_VERSION + '-' + dataset + '/' + filename);
          const task = ref.put(blob, {contentType: 'image/png'});
    
          task.snapshotChanges().pipe(
            finalize(() => {
              blobsUploaded++;
              console.log(`Blobs uploaded ${blobsUploaded}/${count}`);
              if (blobsUploaded == count) this.storeGameInfo(game, dataset);
            })
          ).subscribe()          
        });
      }
    });
  }

  storeGameInfo(game: any, dataset: string) {
    console.log("Storing game info", game);
    this.db.collection<any>(dataset + '-v' + TRANING_DATA_VERSION).add(game);
    this.gameService.setGameAsExported(this.tournamentId, game.gameId, TRANING_DATA_VERSION);
  }

  translateMove(move: string) {
    // TODO: Support languages other than German.
    return move.replace('N', 'S').replace('B', 'L').replace('R', 'T').replace('Q', 'D');
  }

  openNotationDialog(pictureId: string) {
    this.dialog.open(NotationdialogComponent, {
      width: '99%',
      height: '90%',
      data: {picture: {id: pictureId}, tournamentId: this.tournamentId}
    });
  }

  get tournamentId() {
    return this.route.snapshot.params.tournamentid;
  }
}

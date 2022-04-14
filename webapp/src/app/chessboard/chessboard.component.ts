import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
//TODO: re-enable once we get it to compile again
//import { Chessground } from 'chessground';
import * as Chess from 'chess.js';
import { toDests, toColor } from './util'

@Component({
  selector: 'chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css', /*'./chessground.css',*/ './theme.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChessboardComponent implements OnInit {

  chess = new Chess();
  cg:any;
  notationText:string;

  constructor() { 
  }

  ngOnInit() {
/*	  
    this.cg = Chessground(document.getElementById("board"), 
    {movable: {
      color: 'white',
      free: false,
      dests: toDests(this.chess),
    }});
    this.cg.set({
      movable: { events: { after: this.onMovePlayed() } }
    });
*/
  }

  setNotation(){
    this.notationText = this.chess.history().join(" ");
  }

  onMovePlayed(){
    return (orig, dest) => {
      this.chess.move({from: orig, to: dest});
/*
      this.cg.set({
        turnColor: toColor(this.chess),
        movable: {
          color: toColor(this.chess),
          dests: toDests(this.chess)
        }
      });
*/
      this.setNotation();
    };
  }

}

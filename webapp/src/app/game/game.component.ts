import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  /*
  game$ : Chess <= keep up to date from firestore
  currentMove : int <= zero based half moves
  
  == gameinput component ==
  -> [game]= 
  -> (gameChange)=
    -> firestore.update({pgn: newGame.pgn()...})
    -> pass game to notation components (automatically on update)

  -> [(currentMove)]
    == internally == 
    -> for going back, keep a partialGame
    -> maybe keep FEN for updating the board?
    -> on board drag:
       1. is move possible?
       2. extend partialGame
       3. increase currentMove
       4. is partialGame still a subgame of fullGame?
          -> if not, update fullGame and emit pgnChange event
      
  == notation components ==
  -> [(currentMove)]
  -> [game]
    == internally ==
    when game changes:
    1. Go through each move
    2. Translate to local language
    3. Possibly take corrections into account
    4. Render generated move array in component
  */


  constructor() { }

  ngOnInit() {
  }

}

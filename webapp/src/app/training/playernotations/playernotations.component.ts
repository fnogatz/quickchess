import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { NotationcanvasComponent } from '../../notationcanvas/notationcanvas.component';
import { GameExt, GameService } from '../../game.service';
import { NotationService, Notation } from '../../notation.service';
import { NotationdialogComponent } from '../../notationdialog/notationdialog.component';

@Component({
  selector: 'app-playernotations',
  templateUrl: './playernotations.component.html',
  styleUrls: ['./playernotations.component.css']
})
export class PlayernotationsComponent implements OnInit {
  notationsByGame: Object[];

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private notationService: NotationService,
    private dialog: MatDialog
  ) {
    this.notationsByGame = [];
  }

  ngOnInit() {
  }

  findPlayer(playername: string) {
    this.gameService.getGames(this.tournamentId).subscribe(games => {
      games = games.filter(game => game.pgn.indexOf(playername) != -1);
      let gameIds = games.reduce((map, game) => {
        map[game.id] = [];
        return map;
      }, {})
      this.findNotations(gameIds);
    });
  }
  
  findNotations(gameIds: Object) {
    this.notationService.getNotations(this.tournamentId).subscribe(notations => {
      for (let notation of notations) {
        if (notation.gameId && notation.gameId in gameIds) {
          gameIds[notation.gameId].push(notation);
        }
      }
      console.log(gameIds);
      this.notationsByGame = Object.values(gameIds);
    });
  }

  setWriter(notationId: string, writer: string) {
    console.log("Set writer", notationId, writer);
    this.notationService.setWriter(this.tournamentId, notationId, writer);
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DatabaseService } from '../database.service';
import { GameService, GameExt } from '../game.service';

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.css']
})
export class GamelistComponent implements OnInit {
  displayedColumns = ['white', 'black', 'result'];
  databaseName$: Observable<string>;
  games$: Observable<GameExt[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    // Determine database name.
    this.databaseName$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.databaseService.getDatabase(
          params.get('tournamentid'), params.get('databaseid'))),
      map(database => database.name)
    );

    // Load games.
    this.games$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.gameService.getGames(
          params.get('tournamentid'), params.get('databaseid'))),
    );
  }

  onRowClicked(gameId) {
    this.router.navigate(['../../../games', gameId], { relativeTo: this.route });
  }
}

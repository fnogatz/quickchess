import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { Observable, of } from 'rxjs';
import { first, map, startWith, switchMap } from 'rxjs/operators';

import { GameExt, GameService } from '../game.service';


@Component({
  selector: 'gameselector',
  templateUrl: './gameselector.component.html',
  styleUrls: ['./gameselector.component.css']
})
export class GameselectorComponent implements OnInit {
  gameControl = new FormControl();
  gameAutocompleteOptions: Observable<string[]>;
  selectedGame?: GameExt;
  private _tournamentId: string;
  private _games?: GameExt[];

  @ViewChild('gameInput') gameInput: ElementRef<HTMLInputElement>;
  @Output() gameIdChange = new EventEmitter();

  constructor(private gameService: GameService) {
    // Initialize game autocomplete.
    this.gameAutocompleteOptions = this.gameControl.valueChanges.pipe(
      startWith(''),
      switchMap(searchQuery => this.getMatchingGames(searchQuery))
    );
  }

  ngOnInit() {
  }

  selectGame(event: MatAutocompleteSelectedEvent): void {
    this.selectedGame = event.option.value;
    this.gameInput.nativeElement.value = '';
    this.gameControl.setValue(null);
    this.gameIdChange.emit(this.gameId);
  }
  
  unselectGame() {
    this.selectedGame = null;
    this.gameIdChange.emit(this.gameId);
  }
  
  getGameLabel(game?: GameExt): string | undefined {
    if (game) {
      return game.headers['White'] + ' - ' + game.headers['Black'] + ' (' + game.headers['Event'] + ')';
    }
  }

  private getMatchingGames(query: string | GameExt): Observable<any[]> {
    if (!query) {
      return of([])
    }
    return this._getGamesCached().pipe(map(games => {
      if (typeof query === 'string') {
        return games.filter(game => this.isMatchingGame(query, game));
      } else {
        return games.filter(game => game === query);
      }
    }));
  }

  private isMatchingGame(query: string, game: GameExt) {
    var gameLabel = this.getGameLabel(game).toLowerCase();
    for (let keyword of query.toLowerCase().split(' ')) {
      if (gameLabel.indexOf(keyword) == -1) {
        return false;
      }
    }
    return true;
  }

  @Input()
  set tournamentId(tournamentId: string) {
    this._tournamentId = tournamentId;
  }
  get tournamentId() { return this._tournamentId; }

  @Input()
  set gameId(gameId: string) {
    if (!gameId) {
      this.selectedGame = null;
    } else if (gameId != this.gameId) {
      // Load the game from storage.
      this.gameService.getGame(this.tournamentId, gameId).pipe(first()).subscribe(game => {
        this.selectedGame = game;
      });
    }
  }
  get gameId() { return this.selectedGame && this.selectedGame.id; }

  private _getGamesCached() {
    if (this._games) return of(this._games);
    let games = this.gameService.getGames(this.tournamentId);
    games.subscribe(games => {
      this._games = games;
    });
    return games;
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { TournamentlistComponent } from './tournamentlist/tournamentlist.component';

import { AppComponent } from './app.component';
import { DatabaselistComponent } from './databaselist/databaselist.component';
import { GamelistComponent } from './gamelist/gamelist.component';
import { GameComponent } from './game/game.component';
import { NotationlistComponent } from './notationlist/notationlist.component';
import { NotationdialogComponent } from './notationdialog/notationdialog.component';
import { NotationcanvasComponent } from './notationcanvas/notationcanvas.component';
import { GameselectorComponent } from './gameselector/gameselector.component';
import { PlayernotationsComponent } from './training/playernotations/playernotations.component';
import { ExportmovesComponent } from './training/exportmoves/exportmoves.component';
import { ChessboardComponent } from './chessboard/chessboard.component';
import { ExporttrainingdataComponent } from './training/exporttrainingdata/exporttrainingdata.component';

const appRoutes: Routes = [
  { path: '', component: TournamentlistComponent },
  { path: 'tournaments/:tournamentid/databases', component: DatabaselistComponent },
  { path: 'tournaments/:tournamentid/databases/:databaseid/games', component: GamelistComponent },
  { path: 'tournaments/:tournamentid/games/:gameid', component: GameComponent },
  { path: 'tournaments/:tournamentid/notations', component: NotationlistComponent },
  { path: 'tournaments/:tournamentid/training/exportmoves', component: ExportmovesComponent },
  { path: 'tournaments/:tournamentid/training/playernotations', component: PlayernotationsComponent },
  { path: 'export/trainingdata', component: ExporttrainingdataComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    TournamentlistComponent,
    DatabaselistComponent,
    GamelistComponent,
    GameselectorComponent,
    GameComponent,
    NotationlistComponent,
    NotationdialogComponent,
    NotationcanvasComponent,
    PlayernotationsComponent,
    ExportmovesComponent,
    ChessboardComponent,
    ExporttrainingdataComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'angular-webapp'),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
    ),
  ],
  entryComponents: [
    NotationdialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

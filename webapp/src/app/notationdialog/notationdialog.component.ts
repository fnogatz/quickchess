import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { NotationcanvasComponent } from '../notationcanvas/notationcanvas.component';
import { GameExt, GameService } from '../game.service';
import { NotationService, Notation } from '../notation.service';
import { PictureService, PictureWithId } from '../picture.service';
import { TrainingdataService } from '../trainingdata.service';

@Component({
  selector: 'app-notationdialog',
  templateUrl: './notationdialog.component.html',
  styleUrls: ['./notationdialog.component.css']
})
export class NotationdialogComponent implements OnInit {
  tournamentId: string;
  picture: PictureWithId;
  notations: Notation[];
  gameId: string;

  @ViewChild(NotationcanvasComponent)
  private notationCanvas: NotationcanvasComponent;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data,
      private notationService: NotationService,
      private pictureService: PictureService,
      private trainingDataService: TrainingdataService,
      private route: ActivatedRoute
    ) {
    this.picture = data.picture;
    this.tournamentId = data.tournamentId;

    // Initialize notations.
    this.notations = [];
    this.notationService.getNotations(this.tournamentId, this.picture.id)
      .subscribe(notations => {
        // If there is no notation for this picture yet, create a default one.
        // TODO: improve default grid, e.g. use store last grid in localStorage.
        if (notations.length == 0) {
          notations = [this.notationService.newNotation(this.picture.id, 'de')];
        } else {
          this.gameId = notations[0].gameId;
        }
        this.notations = notations;
      });
  }

  ngOnInit() {
  }

  save() {
    // Save notation
    for (let notation of this.notations) {
      notation.gameId = this.gameId || null;
      notation.pictureRotation = this.notationCanvas.rotation;
      this.notationService.createOrUpdateNotation(this.tournamentId, notation);
      console.log("Saving notation", notation);
    }
    this.pictureService.setHasGame(this.tournamentId, this.picture.id, !!this.gameId);
  }
  
  // DEPRECATED - will be removed soon.
  exportTrainingData() {
    this.save();
    for (let notation of this.notations) {
      this.trainingDataService.exportTrainingData(this.tournamentId, notation, this.gameId);
    }
  }

  // DEPRECATED - will be removed soon.
  exportTrainingCsv() {
    this.trainingDataService.exportTrainingCsv();
  }
}

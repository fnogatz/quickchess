import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PictureService, PictureWithId } from '../picture.service';
import { NotationdialogComponent } from '../notationdialog/notationdialog.component';

@Component({
  selector: 'app-notationlist',
  templateUrl: './notationlist.component.html',
  styleUrls: ['./notationlist.component.css']
})
export class NotationlistComponent implements OnInit {
  @ViewChild('fileinput') fileinput: ElementRef;

  displayedColumns = ['filename', 'status'];
  pictures$: Observable<PictureWithId[]>;

  constructor(
    private route: ActivatedRoute,
    private pictureService: PictureService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.pictures$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get("tournamentid")),
      switchMap(tournamentId => this.pictureService.getPictures(tournamentId))
    );
  }

  onRowClicked(picture: PictureWithId) {
    this.dialog.open(NotationdialogComponent, {
      width: '99%',
      height: '90%',
      data: {picture: picture, tournamentId: this.route.snapshot.params.tournamentid}
    });
  }

  uploadButtonClicked() {
    this.fileinput.nativeElement.click();
  }
  
  onFileSelected() {
    const tournamentId = this.route.snapshot.params.tournamentid;
    const files = this.fileinput.nativeElement.files;
    for (var i = 0; i < files.length; i++) {
      this.pictureService.uploadPicture(tournamentId, files[i]);
    }
  }
}

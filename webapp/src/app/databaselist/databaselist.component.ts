import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DatabaseService, DatabaseWithId } from '../database.service';

@Component({
  selector: 'app-databaselist',
  templateUrl: './databaselist.component.html',
  styleUrls: ['./databaselist.component.css']
})
export class DatabaselistComponent implements OnInit {
  @ViewChild('fileinput') fileinput: ElementRef;

  displayedColumns = ['name'];
  databases$: Observable<DatabaseWithId[]>;

  constructor(
    private readonly db: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.databases$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get("tournamentid")),
      switchMap(tournamentId => this.databaseService.getDatabases(tournamentId))
    );
  }

  onRowClicked(databaseId) {
    this.router.navigate([databaseId, 'games'], { relativeTo: this.route });
  }

  uploadButtonClicked() {
    this.fileinput.nativeElement.click();
  }
  
  onPgnSelected() {
    const tournamentId = this.route.snapshot.params.tournamentid;
    const files = this.fileinput.nativeElement.files;
    for (var i = 0; i < files.length; i++) {
      const filename = files[i].name;
      let reader = new FileReader();
      reader.onload = () => this.databaseService.uploadPgn(tournamentId, filename, reader.result as string);
      reader.readAsText(files[i]);
    }
  }
}

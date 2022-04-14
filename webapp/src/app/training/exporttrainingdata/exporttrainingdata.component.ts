import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { finalize, first, map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-exporttrainingdata',
  templateUrl: './exporttrainingdata.component.html',
  styleUrls: ['./exporttrainingdata.component.css']
})
export class ExporttrainingdataComponent implements OnInit {

  constructor(
    private readonly db: AngularFirestore
  ) {}

  ngOnInit() {
  }

  export() {
    // TODO: Logic for what to export here
    this.db.collection<any>('testdata-v2').valueChanges().pipe(take(1)).subscribe(data => {
      console.log(JSON.stringify(data));
    });
  }
}

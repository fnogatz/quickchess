import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router }    from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// TODO: Move to firestore models
export interface Tournament { name: string; }
export interface TournamentId extends Tournament { id: string; }

@Component({
  selector: 'app-tournamentlist',
  templateUrl: './tournamentlist.component.html',
  styleUrls: ['./tournamentlist.component.css']
})
export class TournamentlistComponent {
  displayedColumns = ['name'];
  tournaments: Observable<TournamentId[]>;

  constructor(private readonly db: AngularFirestore, private router: Router) {
    this.tournaments = db.collection<Tournament>('tournaments').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Tournament;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  onRowClicked(rowId) {
    this.router.navigate(['tournaments/', rowId, 'databases']);
  }
}

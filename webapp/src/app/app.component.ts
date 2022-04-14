import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

// TODO: Move to firestore models
export interface Tournament { name: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title$: Observable<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) {}
  
  async ngOnInit() {
    // Determine app title based on :tournamentid from route.
    this.title$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute.firstChild.snapshot.params.tournamentid),
      switchMap(tournamentId => {
        if (!tournamentId) {
          return of(DEFAULT_TITLE);
        }
        const tournament = this.db.doc<Tournament>('tournaments/' + tournamentId);
        return tournament.valueChanges().pipe(
          map(tournament => tournament.name),
          take(1)
        );
      })
    );
  }
}

const DEFAULT_TITLE = 'Quick Chess';

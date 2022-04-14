import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentlistComponent } from './tournamentlist.component';

describe('TournamentlistComponent', () => {
  let component: TournamentlistComponent;
  let fixture: ComponentFixture<TournamentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

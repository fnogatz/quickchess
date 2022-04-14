import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameselectorComponent } from './gameselector.component';

describe('GameselectorComponent', () => {
  let component: GameselectorComponent;
  let fixture: ComponentFixture<GameselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

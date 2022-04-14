import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayernotationsComponent } from './playernotations.component';

describe('PlayernotationsComponent', () => {
  let component: PlayernotationsComponent;
  let fixture: ComponentFixture<PlayernotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayernotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayernotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

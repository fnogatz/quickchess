import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportmovesComponent } from './exportmoves.component';

describe('ExportmovesComponent', () => {
  let component: ExportmovesComponent;
  let fixture: ComponentFixture<ExportmovesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportmovesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportmovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

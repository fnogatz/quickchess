import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExporttrainingdataComponent } from './exporttrainingdata.component';

describe('ExporttrainingdataComponent', () => {
  let component: ExporttrainingdataComponent;
  let fixture: ComponentFixture<ExporttrainingdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExporttrainingdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExporttrainingdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotationlistComponent } from './notationlist.component';

describe('NotationlistComponent', () => {
  let component: NotationlistComponent;
  let fixture: ComponentFixture<NotationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

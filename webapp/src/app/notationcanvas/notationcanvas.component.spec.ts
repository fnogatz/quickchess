import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotationcanvasComponent } from './notationcanvas.component';

describe('NotationcanvasComponent', () => {
  let component: NotationcanvasComponent;
  let fixture: ComponentFixture<NotationcanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotationcanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotationcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

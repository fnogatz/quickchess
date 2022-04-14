import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotationdialogComponent } from './notationdialog.component';

describe('NotationdialogComponent', () => {
  let component: NotationdialogComponent;
  let fixture: ComponentFixture<NotationdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotationdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotationdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

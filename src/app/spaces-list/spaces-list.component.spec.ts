import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacesListComponent } from './spaces-list.component';

describe('SpacesListComponent', () => {
  let component: SpacesListComponent;
  let fixture: ComponentFixture<SpacesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpacesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

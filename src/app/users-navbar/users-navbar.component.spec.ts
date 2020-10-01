import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNavbarComponent } from './users-navbar.component';

describe('UsersNavbarComponent', () => {
  let component: UsersNavbarComponent;
  let fixture: ComponentFixture<UsersNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

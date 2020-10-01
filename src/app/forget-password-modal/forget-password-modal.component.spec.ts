import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordModalComponent } from './forget-password-modal.component';

describe('ForgetPasswordModalComponent', () => {
  let component: ForgetPasswordModalComponent;
  let fixture: ComponentFixture<ForgetPasswordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetPasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

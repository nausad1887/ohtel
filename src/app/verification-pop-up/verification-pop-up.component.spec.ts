import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPopUpComponent } from './verification-pop-up.component';

describe('VerificationPopUpComponent', () => {
  let component: VerificationPopUpComponent;
  let fixture: ComponentFixture<VerificationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

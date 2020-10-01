import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratulationPopUpComponent } from './congratulation-pop-up.component';

describe('CongratulationPopUpComponent', () => {
  let component: CongratulationPopUpComponent;
  let fixture: ComponentFixture<CongratulationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongratulationPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongratulationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

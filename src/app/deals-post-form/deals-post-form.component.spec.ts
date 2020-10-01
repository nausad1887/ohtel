import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPostFormComponent } from './deals-post-form.component';

describe('DealsPostFormComponent', () => {
  let component: DealsPostFormComponent;
  let fixture: ComponentFixture<DealsPostFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPostFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

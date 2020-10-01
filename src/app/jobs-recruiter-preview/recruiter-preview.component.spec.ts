import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterPreviewComponent } from './recruiter-preview.component';

describe('RecruiterPreviewComponent', () => {
  let component: RecruiterPreviewComponent;
  let fixture: ComponentFixture<RecruiterPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruiterPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

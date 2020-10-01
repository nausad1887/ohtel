import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsApplicantPreviewComponent } from './jobs-applicant-preview.component';

describe('JobsApplicantPreviewComponent', () => {
  let component: JobsApplicantPreviewComponent;
  let fixture: ComponentFixture<JobsApplicantPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsApplicantPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsApplicantPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

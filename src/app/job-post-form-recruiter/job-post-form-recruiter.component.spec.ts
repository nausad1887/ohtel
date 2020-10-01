import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostFormRecruiterComponent } from './job-post-form-recruiter.component';

describe('JobPostFormRecruiterComponent', () => {
  let component: JobPostFormRecruiterComponent;
  let fixture: ComponentFixture<JobPostFormRecruiterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPostFormRecruiterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPostFormRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

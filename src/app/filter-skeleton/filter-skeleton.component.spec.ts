import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSkeletonComponent } from './filter-skeleton.component';

describe('FilterSkeletonComponent', () => {
  let component: FilterSkeletonComponent;
  let fixture: ComponentFixture<FilterSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

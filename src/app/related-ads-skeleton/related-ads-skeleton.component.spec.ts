import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedAdsSkeletonComponent } from './related-ads-skeleton.component';

describe('RelatedAdsSkeletonComponent', () => {
  let component: RelatedAdsSkeletonComponent;
  let fixture: ComponentFixture<RelatedAdsSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedAdsSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedAdsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

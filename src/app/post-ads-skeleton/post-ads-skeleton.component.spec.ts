import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAdsSkeletonComponent } from './post-ads-skeleton.component';

describe('PostAdsSkeletonComponent', () => {
  let component: PostAdsSkeletonComponent;
  let fixture: ComponentFixture<PostAdsSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostAdsSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostAdsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

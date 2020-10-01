import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdsSkeletonComponent } from './my-ads-skeleton.component';

describe('MyAdsSkeletonComponent', () => {
  let component: MyAdsSkeletonComponent;
  let fixture: ComponentFixture<MyAdsSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAdsSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

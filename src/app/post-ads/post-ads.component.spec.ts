import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAdsComponent } from './post-ads.component';

describe('PostAdsComponent', () => {
  let component: PostAdsComponent;
  let fixture: ComponentFixture<PostAdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

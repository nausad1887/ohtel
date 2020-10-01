import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionSkeletonComponent } from './subscription-skeleton.component';

describe('SubscriptionSkeletonComponent', () => {
  let component: SubscriptionSkeletonComponent;
  let fixture: ComponentFixture<SubscriptionSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

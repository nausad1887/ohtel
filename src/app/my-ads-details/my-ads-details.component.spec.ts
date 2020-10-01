import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdsDetailsComponent } from './my-ads-details.component';

describe('MyAdsDetailsComponent', () => {
  let component: MyAdsDetailsComponent;
  let fixture: ComponentFixture<MyAdsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAdsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

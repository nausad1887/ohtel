import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteSkeletonComponent } from './favourite-skeleton.component';

describe('FavouriteSkeletonComponent', () => {
  let component: FavouriteSkeletonComponent;
  let fixture: ComponentFixture<FavouriteSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

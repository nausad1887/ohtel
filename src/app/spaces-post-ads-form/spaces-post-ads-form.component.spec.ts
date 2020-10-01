import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacesPostAdsFormComponent } from './spaces-post-ads-form.component';

describe('SpacesPostAdsFormComponent', () => {
  let component: SpacesPostAdsFormComponent;
  let fixture: ComponentFixture<SpacesPostAdsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpacesPostAdsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacesPostAdsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

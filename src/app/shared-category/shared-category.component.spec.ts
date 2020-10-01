import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCategoryComponent } from './shared-category.component';

describe('SharedCategoryComponent', () => {
  let component: SharedCategoryComponent;
  let fixture: ComponentFixture<SharedCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

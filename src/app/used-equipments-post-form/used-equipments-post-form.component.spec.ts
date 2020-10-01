import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedEquipmentsPostFormComponent } from './used-equipments-post-form.component';

describe('UsedEquipmentsPostFormComponent', () => {
  let component: UsedEquipmentsPostFormComponent;
  let fixture: ComponentFixture<UsedEquipmentsPostFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsedEquipmentsPostFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsedEquipmentsPostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

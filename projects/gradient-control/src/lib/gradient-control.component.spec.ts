import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientControlComponent } from './gradient-control.component';

describe('GradientControlComponent', () => {
  let component: GradientControlComponent;
  let fixture: ComponentFixture<GradientControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradientControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradientControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

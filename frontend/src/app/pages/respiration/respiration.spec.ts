import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Respiration } from './respiration';

describe('Respiration', () => {
  let component: Respiration;
  let fixture: ComponentFixture<Respiration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Respiration],
    }).compileComponents();

    fixture = TestBed.createComponent(Respiration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

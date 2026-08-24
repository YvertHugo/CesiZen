import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Informations } from './informations';

describe('Informations', () => {
  let component: Informations;
  let fixture: ComponentFixture<Informations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Informations],
    }).compileComponents();

    fixture = TestBed.createComponent(Informations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

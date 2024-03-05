import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePracticaAcademicaComponent } from './detalle-practica-academica.component';

describe('DetallePracticaAcademicaComponent', () => {
  let component: DetallePracticaAcademicaComponent;
  let fixture: ComponentFixture<DetallePracticaAcademicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallePracticaAcademicaComponent]
    });
    fixture = TestBed.createComponent(DetallePracticaAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPracticasAcademicasComponent } from './list-practicas-academicas.component';

describe('ListPracticasAcademicasComponent', () => {
  let component: ListPracticasAcademicasComponent;
  let fixture: ComponentFixture<ListPracticasAcademicasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPracticasAcademicasComponent]
    });
    fixture = TestBed.createComponent(ListPracticasAcademicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

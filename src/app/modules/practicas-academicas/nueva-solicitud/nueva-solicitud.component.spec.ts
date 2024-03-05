import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSolicitudComponent } from './nueva-solicitud.component';

describe('NuevaSolicitudComponent', () => {
  let component: NuevaSolicitudComponent;
  let fixture: ComponentFixture<NuevaSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaSolicitudComponent]
    });
    fixture = TestBed.createComponent(NuevaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuevaSolicitudComponent } from "./nueva-solicitud/nueva-solicitud.component";
import { ListPracticasAcademicasComponent } from "./list-practicas-academicas/list-practicas-academicas.component";
import { DetallePracticaAcademicaComponent } from "./detalle-practica-academica/detalle-practica-academica.component";

const routes: Routes = [
  {
    path: "nueva-solicitud",
    component: NuevaSolicitudComponent,
  },
  {
    path: "nueva-solicitud/:id/:process",
    component: NuevaSolicitudComponent,
  },
  {
    path: "lista-practicas/:process",
    component: ListPracticasAcademicasComponent,
  },
  {
    path: "detalle-practica-academica/:id/:process",
    component: DetallePracticaAcademicaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PracticasAcademicasRoutingModule {}

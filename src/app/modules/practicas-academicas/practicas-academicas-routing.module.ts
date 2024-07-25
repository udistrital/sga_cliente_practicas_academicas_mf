import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuevaSolicitudComponent } from "./nueva-solicitud/nueva-solicitud.component";
import { ListPracticasAcademicasComponent } from "./list-practicas-academicas/list-practicas-academicas.component";
import { DetallePracticaAcademicaComponent } from "./detalle-practica-academica/detalle-practica-academica.component";
import { AuthGuard } from "src/_guards/auth.guard";

const routes: Routes = [
  {
    path: "crear",
    canActivate: [AuthGuard],
    component: NuevaSolicitudComponent,
  },
  {
    path: "nueva-solicitud/:id/:process",
    canActivate: [AuthGuard],
    component: NuevaSolicitudComponent,
  },
  {
    path: "lista-practicas/:process",
    canActivate: [AuthGuard],
    component: ListPracticasAcademicasComponent,
  },
  {
    path: "detalle-practica-academica/:id/:process",
    canActivate: [AuthGuard],
    component: DetallePracticaAcademicaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PracticasAcademicasRoutingModule { }

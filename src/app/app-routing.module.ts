import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'practicas-academicas',
    loadChildren: () =>
      import('./modules/practicas-academicas/practicas-academicas.module').then(
        (m) => m.PracticasAcademicasModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

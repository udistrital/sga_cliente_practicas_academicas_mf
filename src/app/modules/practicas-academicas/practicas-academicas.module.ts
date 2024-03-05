import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticasAcademicasRoutingModule } from './practicas-academicas-routing.module';
import { ListPracticasAcademicasComponent } from './list-practicas-academicas/list-practicas-academicas.component';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';
import { NewNuxeoService } from 'src/app/services/new_nuxeo.service';
import { TranslateModule } from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { SolicitantePracticaComponent } from './solicitante-practica/solicitante-practica.component';

//MATERIAL
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatError } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DinamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DialogPreviewFileComponent } from 'src/app/components/dialog-preview-file/dialog-preview-file.component';
import { DetallePracticaAcademicaComponent } from './detalle-practica-academica/detalle-practica-academica.component';
import { NgIsGrantedDirective } from 'src/app/directives/ng-is-granted.directive';



@NgModule({
  declarations: [
    ListPracticasAcademicasComponent,
    NuevaSolicitudComponent,
    SolicitantePracticaComponent,
    DinamicFormComponent,
    DialogPreviewFileComponent,
    DetallePracticaAcademicaComponent,
    NgIsGrantedDirective
  ],
  imports: [
    CommonModule,
    PracticasAcademicasRoutingModule,
    TranslateModule,
    MatExpansionModule,
    //FORMULARIOS
    FormsModule,
    ReactiveFormsModule,
    //MATERIAL
    MatSnackBarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTabsModule,
    MatDatepickerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatTableModule, 
    MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule,
    
  ],
  providers: [
    NewNuxeoService,
  ],
})
export class PracticasAcademicasModule { }

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ImplicitAutenticationService } from 'src/app/services/implicit_autentication.service';
import { PracticasAcademicasService } from 'src/app/services/practicas_academicas.service';
import { UserService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'; 
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list-practicas-academicas',
  templateUrl: './list-practicas-academicas.component.html'
})
export class ListPracticasAcademicasComponent {

  displayedColumns: string[] = ['Id', 'FechaRadicacion', 'TipoSolicitud', 'EstadoId', 'Acciones'];
  dataSource = new MatTableDataSource<any>();

  tablaPracticas: any;
  datosPracticas: any
  process!: string;
  sub: any;
  InfoPracticasAcademicas: any = {};
  filterListado = {
    tipo_formulario: 'mini',
    alertas: true,
    hidefield: true,
    btn: false,
    btnLimpiar: false,
    modelo: 'InfoPracticasAcademicas',
    campos: [
      {
        etiqueta: 'input',
        tipo: 'number',
        nombre: 'Numero',
        claseGrid: 'col-12 col-sm-5',
        label: this.translate.instant('GLOBAL.numero'),
        requerido: false,
        minimo: 0,
        deshabilitar: false,
      },
      {
        etiqueta: 'mat-date',
        tipo: 'datetime-local',
        nombre: 'FechaSolicitud',
        claseGrid: 'col-12 col-sm-5',
        label: this.translate.instant('GLOBAL.fecha'),
        requerido: false,
        deshabilitar: false,
      },
      {
        etiqueta: 'button',
        claseGrid: 'col-lg-2 col-md-2',
        nombre: 'Filter',
        claseBoton: 'btn btn-primary btn-sm',
        icono: 'fa fa-search',
        label_i18n: 'buscar',
      },
    ]
  }
  formFilter: boolean = false;
  processEncript: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private practicasService: PracticasAcademicasService,
    private _Activatedroute: ActivatedRoute,
    private autenticationService: ImplicitAutenticationService,
    private userService: UserService,
    public translate: TranslateService,
    private router: Router,
  ) {
    this.crearTabla();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.crearTabla();
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const matchFilter = [];
  
      // Convertir la fecha y comparar
      const formattedDate = data.FechaRadicacion ? this.formatDate(data.FechaRadicacion) : '';
      matchFilter.push(formattedDate.includes(filter));
  
      // Comparar otras propiedades
      matchFilter.push(data.Id.toString().toLowerCase().includes(filter));
      matchFilter.push(data.TipoSolicitud.Nombre.toLowerCase().includes(filter));
      matchFilter.push(data.EstadoId.Nombre.toLowerCase().includes(filter));
      // ... cualquier otra columna que necesites filtrar
  
      // Devuelve true si alguna columna coincide
      return matchFilter.some(Boolean);
    };
  
    this.dataSource.filter = filterValue;
  }

  filterPracticas(event: any) {
    this.InfoPracticasAcademicas = { FechaRadicacion: event.data.FechaSolicitud ? moment(event.data.FechaSolicitud, 'YYYY-MM-DD').format('DD/MM/YYYY') : null, Id: event.data.Numero ? event.data.Numero : null };
    if (this.InfoPracticasAcademicas.Id === null && this.InfoPracticasAcademicas.FechaRadicacion === null) {
      this.InfoPracticasAcademicas = null;
    }
    const endpoint = 'practicas_academicas?query=EstadoTipoSolicitudId.TipoSolicitud.Id:23&fields=Id,FechaRadicacion,EstadoTipoSolicitudId';
    this.practicasService.getPracticas(endpoint, this.InfoPracticasAcademicas, null).subscribe((practicas: any) => {
      this.dataSource.data = practicas;
    });
  }

  crearTabla() {
    this.tablaPracticas = {
      columns: {
        Id: {
          title: this.translate.instant('SOLICITUDES.numero'),
          width: '20%',
          editable: false,
        },
        FechaRadicacion: {
          title: this.translate.instant('SOLICITUDES.fecha'),
          width: '20%',
          valuePrepareFunction: (value: any) => {
            return moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY')
          },
          editable: false,
        },
        TipoSolicitud: {
          title: this.translate.instant('SOLICITUDES.tipo'),
          width: '20%',
          valuePrepareFunction: (value: any) => {
            return value.Nombre;
          },
          editable: false,
        },
        EstadoId: {
          title: this.translate.instant('SOLICITUDES.estado'),
          width: '20%',
          valuePrepareFunction: (value: any) => {
            return value.Nombre;
          },
          editable: false,
        },
      },
      mode: 'external',
      hideSubHeader: true,
      actions: {
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        columnTitle: this.translate.instant('GLOBAL.acciones'),
        custom: [
          {
            name: 'view',
            title:
              '<i class="nb-search" title="' +
              this.translate.instant(
                'PRACTICAS_ACADEMICAS.tooltip_ver_registro',
              ) +
              '"></i>',
          },
        ],
      },
      noDataMessage: this.translate.instant('PRACTICAS_ACADEMICAS.no_data'),
    };
  }

  getPracticasAcademicas(param: any, endpoint: any) {
    if (param === 'news') {
      return this.practicasService.getPracticas(endpoint, null, ['Radicada']);
    }
    if (param === 'process') {
      return this.practicasService.getPracticas(endpoint, null, ['Radicada', 'Rectificar', 'En consejo curricular', 'Acta aprobada', 'Rechazada', 'Requiere modificación']);
    }
    if (param === 'invitation') {
      return this.practicasService.getPracticas(endpoint, null, ['Acta aprobada']);
    }
    if (param === 'report') {
      return this.practicasService.getPracticas(endpoint, null, ['Acta aprobada']);
    }
    if (param === 'list') {
      return this.practicasService.getPracticas(endpoint, null, null);
    }

  }


  ngOnInit() {
    this.sub = this._Activatedroute.paramMap.subscribe((params: any) => {
      const { process } = params.params;
      this.process = atob(process);
      this.processEncript = process;

      this.autenticationService.getRole().then((rol: Array<String>) => {
        let endpoint;
        if (rol.includes('COORDINADOR') || rol.includes('COORDINADOR_PREGADO') || rol.includes('COORDINADOR_POSGRADO')) {
          endpoint = 'practicas_academicas?query=SolicitudId.EstadoTipoSolicitudId.TipoSolicitud.Id:23';
        } else {
          endpoint = 'practicas_academicas?query=SolicitudId.EstadoTipoSolicitudId.TipoSolicitud.Id:23,TerceroId:' + this.userService.getPersonaId();
        }

        this.getPracticasAcademicas(this.process, endpoint).subscribe((practicas: any) => {
          this.dataSource.data = practicas;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource.sortData = (data, sort: MatSort) => {
              if (sort.active && sort.direction !== '') {
                return data.sort((a, b) => {
                  const isAsc = sort.direction === 'asc';
                  switch (sort.active) {
                    case 'FechaRadicacion': return this.compare(a.FechaRadicacion, b.FechaRadicacion, isAsc);
                    default: return 0;
                  }
                });
              } else {
                return data;
              }
            };
            this.sortDataInicial();
            
          }, 50);
        },
          (error: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              title: '404',
              text: this.translate.instant('ERROR.404'),
              footer: this.translate.instant('GLOBAL.cargar') + '-' +
                this.translate.instant('GLOBAL.practicas_academicas'),
              confirmButtonText: this.translate.instant('GLOBAL.aceptar'),
            });
          })
      })
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  verPractica(element: any) {
    if (element.EstadoId.Nombre == 'Requiere modificación' && this.process == 'process') {
      
      this.router.navigateByUrl(`/practicas-academicas/nueva-solicitud/${element['Id']}/${this.processEncript}`)
    } else {
      
      this.router.navigateByUrl(`/practicas-academicas/detalle-practica-academica/${element['Id']}/${this.processEncript}`)
    }
  }

  sortDataInicial() {
    this.sort.active = 'FechaRadicacion';
    this.sort.direction = 'desc'; // 'asc' para ascendente, 'desc' para descendente
    this.sort.sortChange.emit(); // Dispara el evento de cambio de ordenamiento
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${this.pad(date.getDate())}/${this.pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
  
  pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

}

import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { Docente } from "src/app/models/practicas_academicas/docente";
import { NewNuxeoService } from "src/app/services/new_nuxeo.service";
import { PracticasAcademicasService } from "src/app/services/practicas_academicas.service";
import { UserService } from "src/app/services/users.service";
import { FORM_SOLICITUD_PRACTICAS } from "../nueva-solicitud/forms";
import {
  FORM_DOCUMENTOS_ADICIONALES_LEGALIZACION,
  FORM_RESPUESTA_SOLICITUD,
} from "../form-solicitud-practica";
import * as moment from "moment";
import { HttpErrorResponse } from "@angular/common/http";
import Swal from "sweetalert2";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as momentTimezone from "moment-timezone";
import { Location } from "@angular/common";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ViewChild } from "@angular/core";
import { SgaPracticaAcademicaMidService } from "src/app/services/sga_practica_academica_mid.service";

@Component({
  selector: "app-detalle-practica-academica",
  templateUrl: "./detalle-practica-academica.component.html",
  styleUrls: ["./detalle-practica-academica.component.scss"],
})
export class DetallePracticaAcademicaComponent {
  InfoDocentes: Array<Docente> = [];
  InfoPracticasAcademicas: any;
  InfoPersona: any = {};
  InfoRespuesta: any;
  formDocente: FormGroup;
  FormPracticasAcademicas: any;
  formDocumentosAdicionalesLegalizacion: any;
  formRespuestaSolicitud: any;
  periodos: any[] = [];
  files: any = [];
  proyectos: any[] = [];
  estadosList: any = [];
  estado: any;
  idPractica: any;
  fechaRadicado: any;
  espaciosAcademicos: any;
  tiposVehiculo: any;
  Legalizacion: any;
  process: string = "";
  sub: any;
  loading: boolean;
  displayedColumns: string[] = [
    "EstadoTipoSolicitudId",
    "FechaCreacion",
    "Comentario",
    "Acciones",
  ];
  estadosSolicitudesDataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private builder: FormBuilder,
    public translate: TranslateService,
    private sgaPracticaAcademicaMidService: SgaPracticaAcademicaMidService,
    private location: Location,
    private nuxeo: NewNuxeoService,
    private userService: UserService,
    private practicasService: PracticasAcademicasService,
    private _Activatedroute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loading = true;

    this.formDocente = this.builder.group({
      NombreDocente: [{ value: "", disabled: true }],
      NumeroDocumento: [{ value: "", disabled: true }],
      EstadoDocente: [{ value: "", disabled: true }],
    });

    this.FormPracticasAcademicas = FORM_SOLICITUD_PRACTICAS;
    this.formDocumentosAdicionalesLegalizacion =
      FORM_DOCUMENTOS_ADICIONALES_LEGALIZACION;
    this.formRespuestaSolicitud = FORM_RESPUESTA_SOLICITUD;
    this.construirForm();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.inicializiarDatos();
      this.construirForm();
    });
  }

  ngOnInit() {
    this.loadData().then((aux) => {
      this.sub = this._Activatedroute.paramMap.subscribe((params: any) => {
        const { process, id } = params.params;
        this.idPractica = id;
        this.sgaPracticaAcademicaMidService
          .get("practicas-academicas/" + id)
          .subscribe((practica) => {
            const r = <any>practica;
            if (practica !== null && r.success !== false) {
              if (r.status === 200 && practica["data"] !== null) {
                this.InfoPracticasAcademicas = practica["data"];
                this.InfoPracticasAcademicas.FechaHoraRegreso =
                  this.InfoPracticasAcademicas.FechaHoraRegreso.slice(0, -4);
                this.InfoPracticasAcademicas.FechaHoraSalida =
                  this.InfoPracticasAcademicas.FechaHoraSalida.slice(0, -4);

                this.fechaRadicado = moment(
                  this.InfoPracticasAcademicas.FechaRadicado,
                  "YYYY-MM-DD"
                ).format("DD/MM/YYYY");
                this.estado =
                  this.InfoPracticasAcademicas.EstadoTipoSolicitudId.EstadoId.Nombre;

                let aux = [];
                aux.push(this.InfoPracticasAcademicas.DocenteSolicitante);
                this.InfoPracticasAcademicas.DocentesInvitados.forEach(
                  (docente: any) => {
                    aux.push(docente);
                  }
                );
                this.InfoDocentes = aux;
                this.estadosSolicitudesDataSource.data =
                  practica["data"].Estados;
                this.estadosSolicitudesDataSource.paginator = this.paginator;

                this.inicializiarDatos();
                this.loading = false;
              }
            }
          });
        this.process = atob(process);
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getIndexForm(nombre: String): number {
    for (
      let index = 0;
      index < this.FormPracticasAcademicas.campos.length;
      index++
    ) {
      const element = this.FormPracticasAcademicas.campos[index];
      if (element.nombre === nombre) {
        return index;
      }
    }
    return 0;
  }

  loadData() {
    return new Promise((resolve, reject) => {
      this.sgaPracticaAcademicaMidService
        .get("practicas-academicas/parametros/")
        .subscribe(
          (res) => {
            const r = <any>res;
            if (res !== null && r.success !== false) {
              if (r.status === 200 && res["data"] !== null) {
                this.periodos = res["data"]["periodos"];
                this.proyectos = res["data"]["proyectos"];
                this.tiposVehiculo = res["data"]["vehiculos"];
                this.espaciosAcademicos = [
                  { Nombre: "123 - Calculo Integral", Id: 1 },
                ];
                res["data"]["estados"].forEach((estado: any) => {
                  if (
                    estado["Nombre"] !== "Radicada" &&
                    estado["Nombre"] !== "Ejecutada" &&
                    estado["Nombre"] !== "Rectificar"
                  ) {
                    this.estadosList.push(estado);
                  }
                });

                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("Periodo")
                ].opciones = this.periodos;
                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("Periodo")
                ].valor = this.periodos[0];
                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("Periodo")
                ].deshabilitar = true;

                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("EspacioAcademico")
                ].opciones = this.espaciosAcademicos;
                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("EspacioAcademico")
                ].valor = this.espaciosAcademicos[0];

                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("Proyecto")
                ].opciones = this.proyectos;
                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("TipoVehiculo")
                ].opciones = this.tiposVehiculo;

                resolve(true);
              }
            }
          },
          (error: HttpErrorResponse) => {
            Swal.fire({
              icon: "error",
              title: error.status + "",
              text: this.translate.instant("ERROR." + error.status),
              confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
            });
            reject(false);
          }
        );
    });
  }

  inicializiarDatos() {
    this.files = [];
    if (
      this.InfoPracticasAcademicas &&
      this.InfoPracticasAcademicas.Documentos
    ) {
      this.InfoPracticasAcademicas.Documentos.forEach((documento: any) => {
        documento.id = documento.Id;
        switch (documento.Nombre) {
          case "Cronograma":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "cronograma_practica"
            );
            break;
          case "Presupuesto":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "presupuesto_practica"
            );
            break;
          case "Presentacion":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "presentacion_practica"
            );
            break;
          case "ListaEstudiantes":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "lista_estudiantes"
            );
            break;
          case "GuiaPractica":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "guia_practica"
            );
            break;
          case "ListaPersonalApoyo":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "lista_personal_apoyo"
            );
            break;
          case "InformacionAsistente":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "info_asistencia_practica"
            );
            break;
          case "ActaCompromiso":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "acta_compromiso"
            );
            break;
          case "InformePractica":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "informe_practica"
            );
            break;
          case "CumplidoPractica":
            documento.label = this.translate.instant(
              "PRACTICAS_ACADEMICAS." + "cumplido_practica"
            );
            break;
        }
        this.files.push(documento);
      });
    }

    this.userService.tercero$.subscribe((user: any) => {
      this.InfoPersona = {
        ...this.InfoPersona,
        Nombre: user.NombreCompleto,
        FechaRespuesta: new Date(),
        IdTercero: user.Id,
      };
    });
  }

  construirForm() {
    this.FormPracticasAcademicas.titulo = this.translate.instant(
      "PRACTICAS_ACADEMICAS.datos"
    );
    this.FormPracticasAcademicas.btn = "";
    this.FormPracticasAcademicas.campos.forEach((campo: any) => {
      if (campo.etiqueta === "select") {
        switch (campo.nombre) {
          case "Periodo":
            campo.opciones = this.periodos;
            break;
          case "Proyecto":
            campo.opciones = this.proyectos;
            break;
          case "EspacioAcademico":
            campo.opciones = this.espaciosAcademicos;
            break;
          case "TipoVehiculo":
            campo.opciones = this.tiposVehiculo;
            break;
        }
      }
      campo.label = this.translate.instant(
        "PRACTICAS_ACADEMICAS." + campo.label_i18n
      );
      campo.deshabilitar = true;
    });

    this.formDocumentosAdicionalesLegalizacion.campos.forEach(
      (element: any) => {
        element.label = this.translate.instant(
          "PRACTICAS_ACADEMICAS." + element.label_i18n
        );
        element.placeholder = this.translate.instant(
          "PRACTICAS_ACADEMICAS." + element.placeholder_i18n
        );
      }
    );

    this.formRespuestaSolicitud.campos.forEach((element: any) => {
      element.label = this.translate.instant(
        "PRACTICAS_ACADEMICAS." + element.label_i18n
      );
      if (element.etiqueta === "select") {
        switch (element.nombre) {
          case "Estado":
            element.opciones = this.estadosList;
            break;
        }
      }
    });
  }

  verEstado(element: any) {
    const opt: any = {
      title: this.translate.instant("GLOBAL.estado"),
      html: `<strong>Fecha de Creación:</strong> ${moment(
        element.FechaCreacion,
        "YYYY-MM-DD"
      ).format("DD/MM/YYYY")}</span><br>
            <strong>Estado:</strong>${
              this.InfoPracticasAcademicas.EstadoTipoSolicitudId.EstadoId.Nombre
            }
            <br>
            <span class="form-control">${element.Comentario}</span><br>`,
      icon: "info",
      // buttons: true,
      // dangerMode: true,
      showCancelButton: true,
    };
    Swal.fire(opt).then((result) => {
      if (result) {
      }
    });
  }

  enviarInvitacion() {
    this.loading = true;
      this.sgaPracticaAcademicaMidService
      .post(
        "practicas-academicas/invitacion/",
        this.InfoPracticasAcademicas
      )
      .subscribe(
        (res: any) => {
          if (res !== null && res.success !== false) {
            const r = <any>res.data;
            if (res.status === 200 && r["Data"] !== null) {
              this.loading = false;
              this.snackBar.open(
                this.translate.instant(
                  "PRACTICAS_ACADEMICAS.invitaciones_enviadas"
                ),
                "X",
                {
                  duration: 5000,
                  panelClass: ["success-snackbar"],
                }
              );
            }
          } else {
            this.loading = false;
            this.snackBar.open(
              this.translate.instant(
                "PRACTICAS_ACADEMICAS.invitaciones_no_enviadas"
              ),
              "X",
              {
                duration: 5000,
                panelClass: ["error-snackbar"],
              }
            );
          }
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
          Swal.fire({
            icon: "error",
            title: error.status + "",
            text: this.translate.instant("ERROR." + error.status),
            footer:
              this.translate.instant("PRACTICAS_ACADEMICAS.enviar_invitacion") +
              "-" +
              this.translate.instant("PRACTICAS_ACADEMICAS.invitaciones_no_enviadas"),
            confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
          });
        }
      );
  }

  async enviarSolicitud(event: any) {
    if (event.valid) {
      if (event.nombre === "RESPUESTA_SOLICITUD") {
        this.InfoRespuesta = event.data.documental;
        this.InfoRespuesta.FechaRespuesta =
          momentTimezone
            .tz(event.data.documental.FechaRespuesta, "America/Bogota")
            .format("YYYY-MM-DD HH:mm:ss") + " +0000 +0000";
        this.InfoRespuesta.EstadoTipoSolicitudIdAnterior =
          this.InfoPracticasAcademicas.EstadoTipoSolicitudId;
        this.loading = true;
        this.sgaPracticaAcademicaMidService
          .put("practicas-academicas/" + this.idPractica, this.InfoRespuesta)
          .subscribe(
            (res: any) => {
              if (res !== null && res.success !== false) {
                const r = <any>res.data;
                if (res.status === 200 && r["Data"] !== null) {
                  this.ngOnInit();

                  this.practicasService.clearCache();
                  this.loading = false;
                  this.snackBar.open(
                    this.translate.instant("GLOBAL.info_estado"),
                    this.translate.instant("GLOBAL.confirmarActualizar"),
                    {
                      duration: 5000,
                      panelClass: ["success-snackbar"],
                    }
                  );
                }
              } else {
                this.loading = false;
                this.snackBar.open(
                  this.translate.instant("GLOBAL.error_practicas_academicas"),
                  "X",
                  {
                    duration: 5000,
                    panelClass: ["error-snackbar"],
                  }
                );
              }
            },
            (error: HttpErrorResponse) => {
              Swal.fire({
                icon: "error",
                title: error.status + "",
                text: this.translate.instant("ERROR." + error.status),
                footer:
                  this.translate.instant("GLOBAL.crear") +
                  "-" +
                  this.translate.instant("GLOBAL.info_practicas_academicas"),
                confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
              });
            }
          );
      }
    }
  }

  changeLoading(event: any) {
    this.loading = event;
  }

  async enviarLegalizacion(event: any) {
    let files: Array<any> = [];
    this.Legalizacion = event.data.documental;
    for (const key in this.Legalizacion) {
      if (Object.prototype.hasOwnProperty.call(this.Legalizacion, key)) {
        const element = this.Legalizacion[key];
        if (typeof element.file !== "undefined" && element.file !== null) {
          this.loading = true;
          const file = {
            file: await this.nuxeo.fileToBase64(element.file),
            IdTipoDocumento: element.IdDocumento,
            metadatos: {
              NombreArchivo: element.nombre,
              Tipo: "Archivo",
              Observaciones: element.nombre,
              "dc:title": element.nombre,
            },
            descripcion: element.nombre,
            nombre: element.nombre,
            key: "Documento",
          };
          files.push(file);
        }
      }
    }

    this.InfoPracticasAcademicas.Documentos = files;

    this.InfoPracticasAcademicas.FechaHoraRegreso =
      momentTimezone
        .tz(this.InfoPracticasAcademicas.FechaHoraRegreso, "America/Bogota")
        .format("YYYY-MM-DD HH:mm:ss") + " +0000 +0000";
    this.InfoPracticasAcademicas.FechaHoraSalida =
      momentTimezone
        .tz(this.InfoPracticasAcademicas.FechaHoraSalida, "America/Bogota")
        .format("YYYY-MM-DD HH:mm:ss") + " +0000 +0000";
    const hoy = new Date();
    this.InfoPracticasAcademicas.FechaRadicacion = momentTimezone
      .tz(
        hoy.getFullYear() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getDate(),
        "America/Bogota"
      )
      .format("YYYY-MM-DD HH:mm:ss");
    this.InfoPracticasAcademicas.FechaRadicacion =
      this.InfoPracticasAcademicas.FechaRadicacion + " +0000 +0000";

    this.InfoPracticasAcademicas.EstadoTipoSolicitudIdAnterior =
      this.InfoPracticasAcademicas.EstadoTipoSolicitudId;
    this.InfoPracticasAcademicas.Estado = { Id: 23 };
    this.InfoPracticasAcademicas.IdTercero = this.InfoPersona.IdTercero;
    this.InfoPracticasAcademicas.FechaRespuesta =
      momentTimezone
        .tz(event.data.documental.FechaRespuesta, "America/Bogota")
        .format("YYYY-MM-DD HH:mm:ss") + " +0000 +0000";
    this.InfoPracticasAcademicas.Comentario = "";
    this.InfoPracticasAcademicas.Estados = [];
    this.sgaPracticaAcademicaMidService
      .put("practicas-academicas", this.InfoPracticasAcademicas)
      .subscribe(
        (res: any) => {
          if (res !== null && res.success !== false) {
            const r = <any>res.data;
            if (res.status === 200 && r["Data"] !== null) {
              this.ngOnInit();
              this.FormPracticasAcademicas.campos.forEach((campo: any) => {
                campo.deshabilitar = true;
              });
              this.formDocumentosAdicionalesLegalizacion.campos.forEach(
                (campo: any) => {
                  campo.deshabilitar = true;
                }
              );
              this.practicasService.clearCache();
              this.loading = false;
              this.snackBar.open(
                this.translate.instant("GLOBAL.info_estado"),
                this.translate.instant("GLOBAL.confirmarActualizar"),
                { duration: 5000, panelClass: ["success-snackbar"] }
              );
            }
          } else {
            this.loading = false;
            this.snackBar.open(
              this.translate.instant("GLOBAL.error_practicas_academicas"),
              "X",
              { duration: 5000, panelClass: ["error-snackbar"] }
            );
          }
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            icon: "error",
            title: error.status + "",
            text: this.translate.instant("ERROR." + error.status),
            footer:
              this.translate.instant("GLOBAL.crear") +
              "-" +
              this.translate.instant("GLOBAL.info_practicas_academicas"),
            confirmButtonText: this.translate.instant("GLOBAL.aceptar"),
          });
        }
      );
  }

  goback() {
    this.location.back();
  }
}

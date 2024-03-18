import { Component } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";

import { Docente } from "src/app/models/practicas_academicas/docente";
import { NewNuxeoService } from "src/app/services/new_nuxeo.service";
import { UserService } from "src/app/services/users.service";
import { PracticasAcademicasService } from "src/app/services/practicas_academicas.service";
import { SolicitudPracticaAcademica } from "src/app/models/practicas_academicas/solicitud_practica_academica";

import { FORM_SOLICITUD_PRACTICAS, FORM_SOPORTES_DOCUMENTALES } from "./forms";

import * as moment from "moment";
import * as momentTimezone from "moment-timezone";
import Swal from "sweetalert2";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SgaPracticaAcademicaMidService } from "src/app/services/sga_practica_academica_mid.service";

@Component({
  selector: "app-nueva-solicitud",
  templateUrl: "./nueva-solicitud.component.html",
  styleUrls: ["./nueva-solicitud.component.scss"],
})
export class NuevaSolicitudComponent {
  info_persona_id: number = 0;
  InfoPracticasAcademicas: any;
  InfoDocumentos: any;
  InfoDocentes: Array<Docente> = [];
  NuevaSolicitud: any;
  FormPracticasAcademicas: any;
  FormSoporteDocumentales: any;
  periodos: any[] = [];
  proyectos: any[] = [];
  espaciosAcademicos: any[] = [];
  tiposVehiculo: any[] = [];
  limpiar: boolean = true;
  loading: boolean = false;
  llenarDocumentos: boolean = false;
  sub: any;
  idPractica: any;
  process: string = "";
  estado: any;
  estadosSolicitud: any;
  fechaRadicado: any;
  tablaEstados: any;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private nuxeo: NewNuxeoService,
    private practicasService: PracticasAcademicasService,
    private _Activatedroute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private sgaPracticaAcademicaMidService: SgaPracticaAcademicaMidService,
    private snackBar: MatSnackBar
  ) {
    this.FormSoporteDocumentales = FORM_SOPORTES_DOCUMENTALES;
    this.FormPracticasAcademicas = FORM_SOLICITUD_PRACTICAS;

    this.construirForm();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.construirForm();
    });
  }

  ngOnInit() {
    this.loading = true;
    this.construirForm();

    this.loadData().then((aux) => {
      this.sub = this._Activatedroute.paramMap.subscribe((params: any) => {
        const { process, id } = params.params;
        this.idPractica = id;
        if (id) {
          this.process = atob(process);
          if (this.process == "process") {
            this.sgaPracticaAcademicaMidService
              .get("practicas-academicas/" + id)
              .subscribe(async (practica) => {
                if (practica !== null && practica.success !== false) {
                  const r = <any>practica;
                  if (r.status === 200 && practica["data"] !== null) {
                    this.InfoPracticasAcademicas = practica["data"];
                    this.InfoPracticasAcademicas.FechaHoraRegreso =
                      this.InfoPracticasAcademicas.FechaHoraRegreso.slice(
                        0,
                        -4
                      );
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
                    this.estadosSolicitud = practica["Data"].Estados;
                    let docs = await this.cargarDocs(
                      this.InfoPracticasAcademicas.Documentos
                    );
                  }
                }
              });

            this.tablaEstados = {
              columns: {
                EstadoTipoSolicitudId: {
                  title: this.translate.instant("SOLICITUDES.estado"),
                  width: "20%",
                  valuePrepareFunction: (value: any) => {
                    return value.EstadoId.Nombre;
                  },
                  editable: false,
                },
                FechaCreacion: {
                  title: this.translate.instant("SOLICITUDES.fecha"),
                  width: "20%",
                  valuePrepareFunction: (value: any) => {
                    return moment(value, "YYYY-MM-DD").format("DD/MM/YYYY");
                  },
                  editable: false,
                },
                Comentario: {
                  title: this.translate.instant("SOLICITUDES.observaciones"),
                  width: "20%",
                  editable: false,
                },
              },
              mode: "external",
              hideSubHeader: true,
              actions: {
                add: false,
                edit: false,
                delete: false,
                position: "right",
                columnTitle: this.translate.instant("GLOBAL.acciones"),
                custom: [
                  {
                    name: "view",
                    title:
                      '<i class="nb-search" title="' +
                      this.translate.instant(
                        "PRACTICAS_ACADEMICAS.tooltip_ver_registro"
                      ) +
                      '"></i>',
                  },
                ],
              },
              noDataMessage: this.translate.instant(
                "PRACTICAS_ACADEMICAS.no_data"
              ),
            };
          }
        }
      });
    });
    this.loading = false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  cargarDocs(files: any) {
    return new Promise((resolve, reject) => {
      this.loading = true;

      files.forEach((documento: any) => {
        this.nuxeo.getByUUID(documento.Enlace).subscribe((res) => {
          switch (documento.Nombre) {
            case "Cronograma":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("Cronograma")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("Cronograma")
              ].urlTemp = res;
              break;
            case "Presupuesto":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("Presupuesto")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("Presupuesto")
              ].urlTemp = res;
              break;
            case "Presentacion":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("Presentacion")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("Presentacion")
              ].urlTemp = res;
              break;
            case "ListaEstudiantes":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("ListaEstudiantes")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("ListaEstudiantes")
              ].urlTemp = res;
              break;
            case "GuiaPractica":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("GuiaPractica")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("GuiaPractica")
              ].urlTemp = res;
              break;
            case "ListaPersonalApoyo":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("ListaPersonalApoyo")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("ListaPersonalApoyo")
              ].urlTemp = res;
              break;
            case "InformacionAsistente":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("InformacionAsistente")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("InformacionAsistente")
              ].urlTemp = res;
              break;
            case "ActaCompromiso":
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("ActaCompromiso")
              ].valor = res;
              this.FormSoporteDocumentales.campos[
                this.getIndexFormDoc("ActaCompromiso")
              ].urlTemp = res;
              break;
          }
        });
      });
      this.loading = false;

      resolve(true);
    });
  }

  getIndexFormDoc(nombre: String): number {
    for (
      let index = 0;
      index < this.FormSoporteDocumentales.campos.length;
      index++
    ) {
      const element = this.FormSoporteDocumentales.campos[index];
      if (element.nombre === nombre) {
        return index;
      }
    }
    return 0;
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
            if (res !== null && res.success !== false) {
              const r = <any>res;
              if (r.status === 200 && res["data"] !== null) {
                this.periodos = res["data"]["periodos"];
                this.proyectos = res["data"]["proyectos"];
                this.tiposVehiculo = res["data"]["vehiculos"];

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
                  this.getIndexForm("Duracion")
                ].deshabilitar = true;

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

  construirForm() {
    this.info_persona_id = this.userService.getPersonaId();
    this.FormPracticasAcademicas.titulo = this.translate.instant(
      "PRACTICAS_ACADEMICAS.datos"
    );
    this.FormPracticasAcademicas.btn =
      this.translate.instant("GLOBAL.siguiente");
    for (let i = 0; i < this.FormPracticasAcademicas.campos.length; i++) {
      this.FormPracticasAcademicas.campos[i].label = this.translate.instant(
        "PRACTICAS_ACADEMICAS." +
          this.FormPracticasAcademicas.campos[i].label_i18n
      );
      this.FormPracticasAcademicas.campos[i].placeholder =
        this.translate.instant(
          "PRACTICAS_ACADEMICAS.placeholder_" +
            this.FormPracticasAcademicas.campos[i].label_i18n
        );
      this.FormPracticasAcademicas.campos[i].deshabilitar = false;
    }

    this.FormSoporteDocumentales.titulo = this.translate.instant(
      "PRACTICAS_ACADEMICAS.datos"
    );
    this.FormSoporteDocumentales.btn =
      this.translate.instant("SOLICITUDES.enviar");

    this.FormSoporteDocumentales.campos =
      this.FormSoporteDocumentales.campos.map((campo: any) => {
        return {
          ...campo,
          ...{
            label: this.translate.instant(
              "PRACTICAS_ACADEMICAS." + campo.label_i18n
            ),
            deshabilitar: false,
          },
        };
      });
  }

  async enviarSolicitud(event: any) {
    try {
      this.InfoPracticasAcademicas = event.data.InfoPracticasAcademicas;
      if (event.valid) {
        if (event.nombre === "SOLICITUD_PRACTICAS") {
          this.NuevaSolicitud = <SolicitudPracticaAcademica>(
            event.data.InfoPracticasAcademicas
          );
          let docenteAux: Array<Docente> = [];
          this.InfoDocentes.forEach((docente: any) => {
            if (docente["PuedeBorrar"]) {
              docenteAux.push(docente);
            } else {
              this.NuevaSolicitud.SolicitanteId = docente.Id;
              this.NuevaSolicitud.DocenteSolicitante = docente;
            }
          });

          this.NuevaSolicitud.DocentesInvitados = docenteAux;
          this.FormPracticasAcademicas.btn = null;
          this.llenarDocumentos = true;
        }

        if (event.nombre === "SOPORTES_DOCUMENTALES") {
          this.loading = true;
          let files: Array<any> = [];
          this.InfoDocumentos = event.data.documental;
          for (const element of Object.values(
            this.InfoDocumentos as Record<string, any>
          )) {
            if (element.file instanceof File) {
              // Verificación explícita del tipo de archivo
              this.loading = true;
              try {
                const fileBase64 = await this.nuxeo.fileToBase64(element.file);
                const file = {
                  file: fileBase64,
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
              } catch (error) {
                console.error("Error al convertir el archivo a Base64:", error);
              }
            }
          }
          this.NuevaSolicitud.Documentos = files;
          this.loading = false;

          this.NuevaSolicitud.FechaHoraRegreso =
            momentTimezone
              .tz(this.NuevaSolicitud.FechaHoraRegreso, "America/Bogota")
              .format("YYYY-MM-DD HH:mm:ss") + " +0000 +0000";
          this.NuevaSolicitud.FechaHoraSalida =
            momentTimezone
              .tz(this.NuevaSolicitud.FechaHoraSalida, "America/Bogota")
              .format("YYYY-MM-DD HH:mm:ss") + " +0000 +0000";

          this.NuevaSolicitud.FechaRadicacion = moment().format(
            "YYYY-MM-DD HH:mm:ss"
          );
          const apiCall = this.idPractica
            ? this.sgaPracticaAcademicaMidService.put(
                "practicas-academicas",
                this.NuevaSolicitud
              )
            : this.sgaPracticaAcademicaMidService.post(
                "practicas-academicas/",
                this.NuevaSolicitud
              );

          apiCall.subscribe(
            (res: any) => {
              this.loading = false;
              if (res !== null && res.success !== false) {
                const r = <any>res.data[0];
                this.practicasService.clearCache();
                const solicitudId = r.Solicitud.Id;
                Swal.fire({
                  title:
                    this.translate.instant("GLOBAL.info_estado") +
                    " " +
                    this.translate.instant(
                      "PRACTICAS_ACADEMICAS.solicitud_creada"
                    ) +
                    solicitudId,

                  icon: "success",
                  confirmButtonText: "Cerrar",
                }).then(() => {
                  this.router.navigate([
                    `/practicas-academicas/lista-practicas/${btoa("process")}`,
                  ]);
                });
              } else {
                Swal.fire({
                  title: this.translate.instant(
                    "GLOBAL.error_practicas_academicas"
                  ),
                  icon: "error",
                  confirmButtonText: "Reintentar",
                  cancelButtonText: "Salir",
                  showCancelButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    // Código para reintentar la acción
                  } else {
                    this.router.navigate(["/practicas-academicas"]);
                  }
                });
              }
            },
            (error: HttpErrorResponse) => {
              this.loading = false;
              Swal.fire({
                title: `Error ${error.status}`,
                text: this.translate.instant("ERROR." + error.status),
                icon: "error",
                confirmButtonText: "Reintentar",
                cancelButtonText: "Salir",
                showCancelButton: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  // Código para reintentar la acción
                } else {
                  this.router.navigate(["/practicas-academicas"]);
                }
              });
            }
          );
        }
      }
    } catch (error) {
      this.loading = false;
      this.snackBar.open(
        this.translate.instant("ERROR." + error),
        this.translate.instant("GLOBAL.aceptar"),
        {
          duration: 5000,
          panelClass: ["error-snackbar"],
          horizontalPosition: "right",
          verticalPosition: "top",
        }
      );
    }
  }

  verEstado(event: any) {
    const opt: any = {
      title: this.translate.instant("GLOBAL.estado"),
      html: `<span>${moment(event.data.FechaCreacion, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      )}</span><br>
                <span>${
                  this.InfoPracticasAcademicas.EstadoTipoSolicitudId.EstadoId
                    .Nombre
                }</span><br>
                <span class="form-control">${event.data.Comentario}</span><br>`,
      icon: "info",
      showCancelButton: true,
    };
    Swal.fire(opt).then((result) => {
      if (result) {
      }
    });
  }

  getSeleccion(event: any) {
    this.changeLoading(true);
    if (event.nombre === "Proyecto") {
      this.sgaPracticaAcademicaMidService
        .get("practicas-academicas/espacios-academicos/" + this.info_persona_id)
        .subscribe(
          (res) => {
            if (res !== null && res.success !== false) {
              const r = <any>res.data;
              if (res.status === 200 && res["data"] !== null) {
                this.espaciosAcademicos = res["data"];

                this.FormPracticasAcademicas.campos[
                  this.getIndexForm("EspacioAcademico")
                ].opciones = this.espaciosAcademicos;
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
          }
        );
    } else if (
      event.nombre === "FechaHoraRegreso" ||
      event.nombre === "FechaHoraSalida"
    ) {
      const campoRegreso =
        this.FormPracticasAcademicas.campos[
          this.getIndexForm("FechaHoraRegreso")
        ];
      const fechaRegreso = new Date(campoRegreso.valor);

      const campoSalida =
        this.FormPracticasAcademicas.campos[
          this.getIndexForm("FechaHoraSalida")
        ];
      const fechaSalida = new Date(campoSalida.valor);

      campoSalida.max = campoRegreso.valor;
      campoRegreso.min = campoSalida.valor;

      const dias = fechaRegreso.getTime() - fechaSalida.getTime();
      this.FormPracticasAcademicas.campos[this.getIndexForm("Duracion")].valor =
        Math.abs(Math.round(dias / (1000 * 60 * 60 * 24)));

      // if (fechaSalida.getTime() > fechaRegreso.getTime()) {
      //   campoRegreso.clase = 'form-control form-control-danger';
      //   campoRegreso.alerta = 'La fecha no es posible';

      //   campoSalida.clase = 'form-control form-control-danger';
      //   campoSalida.alerta = 'fecha menor';
      // } else {
      //   campoRegreso.clase = 'form-control form-control-success';
      //   campoRegreso.alerta = '';

      //   campoSalida.clase = 'form-control form-control-success';
      //   campoSalida.alerta = '';
      // }
    }

    this.changeLoading(false);
  }

  changeLoading(event: any) {
    this.loading = event;
  }

  loadDocentes(event: any) {
    this.InfoDocentes = event;
  }

  goback() {
    this.location.back();
  }
}

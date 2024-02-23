import { Component, Input } from "@angular/core";
import { DocumentoService } from "src/app/services/documento.service";
import { NewNuxeoService } from "src/app/services/new_nuxeo.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { DialogPreviewFileComponent } from "../dialog-preview-file/dialog-preview-file.component";
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { of } from "rxjs";

@Component({
  selector: "ngx-download-file-nuxeo",
  templateUrl: "./download-file-nuxeo.component.html",
  styleUrls: ["./download-file-nuxeo.component.scss"],
})
export class DownloadFileNuxeoComponent {
  //DECLARACION DE VARIABLES DEL COMPONENTE
  private archivo: any = null;
  private _idDoc!: number;
  private urlBlobOriginal: string | null = null;
  loading: boolean = true;
  informacionArchivo: any = null;
  esAbiertoMenu: boolean = false;
  error: boolean = false;

  @Input("file")
  set file(file: any) {
    this.archivo = file;
    this.cargarArchivo();
  }

  //CONSTRUCTOR DEL COMPONENTE
  constructor(
    private documentoService: DocumentoService,
    private nuxeoService: NewNuxeoService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}


  cargarArchivo() {
    if (this.archivo) {
      this.loading = true;
      this.error = false;
      
      this.nuxeoService
        .get([this.archivo])
        .pipe(
          catchError((err) => {
            this.loading = false;
            this.error = true;
            return of(null);
          })
        )
        .subscribe(
          respuesta => {
            if(respuesta.error){
              this.error = true;
              this.loading = false;
              return
            }
            
            if (respuesta) {
              this.informacionArchivo = respuesta[0];
              this.urlBlobOriginal = this.informacionArchivo.url;
              this.informacionArchivo.url =
                this.sanitizer.bypassSecurityTrustResourceUrl(
                  this.informacionArchivo.url
                );
              this.loading = false
            }
            
            this.loading = false;
          },
          err => {
            this.error = true;
            this.loading = false;
          }          
        );
    }
  }

  descargarArchivo() {
    if (this.informacionArchivo && this.urlBlobOriginal) {
      const a = document.createElement("a");
      a.href = this.urlBlobOriginal; // Usar la URL original del Blob
      a.download = this.informacionArchivo.Nombre || "descarga";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  verArchivo() {
    if (this.informacionArchivo && this.urlBlobOriginal) {
      const dialogRef = this.dialog.open(DialogPreviewFileComponent, {
        width: "80%",
        height: "80%",
        data: {
          url: this.urlBlobOriginal,
          title: this.informacionArchivo.Nombre,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
      });
    }
  }
}

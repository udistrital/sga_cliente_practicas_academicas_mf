import { TipoParametro } from "./tipo_parametro";

export interface Parametro {
    Id: number;
    Nombre: string;
    Descripcion: string;
    CodigoAbreviacion: string;
    Activo: boolean;
    NumeroOrden: number;
    TipoParametroId: TipoParametro;
  }

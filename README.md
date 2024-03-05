# SgaClientePracticasAcademicasMf



## Especificaciones Técnicas

* This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.12.
* Tailwind
* sweetalert2
* Angular Material

## Servidor de desarrollo

Run `ng serve` for a dev server. Navigate to `http://localhost:4210/`. The application will automatically reload if you change any of the source files.

## Instalación y ejecución

``` bash
# Clonar el repositorio
git clone git@github.com:udistrital/sga_cliente_practicas_academicas_mf.git

# Entrar en el dictorio del proyecto
cd sga_cliente_practicas_academicas_mf

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

## Variables de entorno

```bash
export const environment = {
  production: false,
  apiUrl: "http://localhost:4210/",
  NUXEO: {
    PATH: "xxx",
    CREDENTIALS: {
      USERNAME: "xxx",
      PASS: "xxx",
    },
  },
  NUXEO_SERVICE: "xxx",
  TERCEROS_SERVICE: 'xxx',
  SGA_MID_SERVICE: "xxx",
  DOCUMENTO_SERVICE: 'xxx',
};

```

## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
| [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/sga_cliente_practicas_academicas_mf/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/sga_cliente_practicas_academicas_mf/) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/sga_cliente_practicas_academicas_mf/status.svg?ref=refs/heads/release/0.0.1)](https://hubci.portaloas.udistrital.edu.co/udistrital/sga_cliente_practicas_academicas_mf/) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/sga_cliente_practicas_academicas_mf/status.svg)](https://hubci.portaloas.udistrital.edu.co/udistrital/sga_cliente_practicas_academicas_mf/) |


## Licencia

sga_cliente_practicas_academicas_mf is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

sga_cliente_practicas_academicas_mf is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with novedades_crud. If not, see https://www.gnu.org/licenses/.
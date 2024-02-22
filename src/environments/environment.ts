export const environment = {
  production: false,
  apiUrl: "http://localhost:4210/",
  NUXEO: {
    PATH: "https://documental.portaloas.udistrital.edu.co/nuxeo/",
    CREDENTIALS: {
      USERNAME: "xxx",
      PASS: "xxx",
    },
  },
  //NUXEO_SERVICE:'https://autenticacion.portaloas.udistrital.edu.co/apioas/gestor_documental_mid/v1',
  NUXEO_SERVICE: "http://pruebasapi2.intranetoas.udistrital.edu.co:8199/v1",
  //TERCEROS_SERVICE:
  //  "https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/",
  TERCEROS_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8121/v1/',
  //SGA_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/sga_mid/v1/',
  //SGA_MID_SERVICE: 'http://localhost:8119/v1/',
  SGA_MID_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8119/v1/",
  DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
};

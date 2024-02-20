import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-route',
  template: `
    <div class="empty-route-container">
      <h1>¡Bienvenido!</h1>
      <p>Esta ruta no tiene contenido asignado aún.</p>
      <p>Por favor, selecciona una opción del menú principal.</p>
    </div>
  `,
  styles: [`
    .empty-route-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      background-color: #f3f4f6;
      color: #333;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #1976d2;
      margin-bottom: 20px;
    }
    p {
      color: #555;
      font-size: 16px;
    }
  `]
})
export class EmptyRouteComponent {}

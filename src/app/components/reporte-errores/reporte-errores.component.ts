import { Component, OnInit } from '@angular/core';
import { ErrorCom } from '../../models/ErrorCom';

@Component({
  selector: 'app-reporte-errores',
  templateUrl: './reporte-errores.component.html',
  styleUrls: ['./reporte-errores.component.scss']
})
export class ReporteErroresComponent implements OnInit {

  errores: ErrorCom[] = [];

  constructor() { }

  ngOnInit(): void {
    this.errores = [
      {
        tipo: 'Lexico',
        desc: 'Simbolo no existe',
        lin: 1,
        col: 1,
        lexema: '%'
      },
      {
        tipo: 'Sintactico',
        desc: 'No se esperaba componente',
        lin: 8,
        col: 4,
        lexema: 'AAA'
      }
    ];
  }

}

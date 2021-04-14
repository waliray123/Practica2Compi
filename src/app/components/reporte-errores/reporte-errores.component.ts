import { Component, OnInit } from '@angular/core';
import { ErrorCom } from '../../models/ErrorCom';
import {DbAnalizadoresService} from 'src/app/services/db-analizadores.service';

@Component({
  selector: 'app-reporte-errores',
  templateUrl: './reporte-errores.component.html',
  styleUrls: ['./reporte-errores.component.scss']
})
export class ReporteErroresComponent implements OnInit {

  errores: ErrorCom[] = [];

  constructor(private dbAnServ:DbAnalizadoresService) { }

  ngOnInit(): void {
    this.errores = this.dbAnServ.getErrores();
  }

}

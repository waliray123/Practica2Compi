import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import  { AnlizadorWisonComponent  } from './components/anlizador-wison/anlizador-wison.component';
import  { AnalizadoresComponent  } from './components/analizadores/analizadores.component';
import  { ReporteErroresComponent  } from './components/reporte-errores/reporte-errores.component';

const routes: Routes = [
  {
    path: '',
    component: AnlizadorWisonComponent
  },
  {
    path: 'analizadores',
    component: AnalizadoresComponent
  },
  {
    path: 'reporteErrores',
    component: ReporteErroresComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AnlizadorWisonComponent } from './components/anlizador-wison/anlizador-wison.component';
import { AnalizadoresComponent } from './components/analizadores/analizadores.component';
import { ReporteErroresComponent } from './components/reporte-errores/reporte-errores.component';
import { ErrorComComponent } from './components/error-com/error-com.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AnlizadorWisonComponent,
    AnalizadoresComponent,
    ReporteErroresComponent,
    ErrorComComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

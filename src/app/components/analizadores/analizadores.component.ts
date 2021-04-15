import { Component, OnInit } from '@angular/core';
import { AnalizadorLexico } from 'src/app/controlers/AnalizadorLexico';
import { AnalizadorSintactico } from 'src/app/controlers/AnalizadorSintactico';
import { Analizador } from 'src/app/models/Analizador';
import {DbAnalizadoresService} from 'src/app/services/db-analizadores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analizadores',
  templateUrl: './analizadores.component.html',
  styleUrls: ['./analizadores.component.scss']
})
export class AnalizadoresComponent implements OnInit {

  analizadores : Analizador[] = [];
  entrada:string = '';
  nombreAnalizadores : string[] = [];
  nombreAnalizador : string = '';
  mensaje :  string = '';

  constructor(private dbAnServ:DbAnalizadoresService,private router:Router) { }

  ngOnInit(): void {  
    this.analizadores = this.dbAnServ.getAnalizadores();
    for(let analizador of this.analizadores){
      this.nombreAnalizadores.push(analizador.getNombre());      
    }
    //console.log(this.analizadores);
  }

  onSubmit(){
    console.log(this.nombreAnalizador);
    if(this.entrada != "" && this.nombreAnalizador != ""){
      var analizador = this.obtenerAnalizador();
      console.log(analizador);
      //Llamar a traer tokens
      var analizadorLex = new AnalizadorLexico(this.entrada,analizador);
      var tokens = analizadorLex.getTokens();
      var errores = analizadorLex.getErrores();
      if(errores.length == 0){
        var analizadorSintactico = new AnalizadorSintactico(analizador,tokens); 
        var esAmbigua = analizadorSintactico.getEsAmbigua();
        if(esAmbigua == true){
          this.mensaje = "La gramatica es ambigua";
        }else{
          this.mensaje = "La entrada analizada";
        }
      }else{
        this.dbAnServ.setErrores(errores);
        this.router.navigate(["/reporteErrores"]);
      }
      //console.log(tokens);
      //console.log(errores);
    }
  }

  obtenerAnalizador(): Analizador{
    var analiza = new Analizador();
    for(let analizador of this.analizadores){
      var nombreA = analizador.getNombre();
      if (nombreA == this.nombreAnalizador){
        return analizador;
      } 
    }
    return analiza;
  }

  
  


}

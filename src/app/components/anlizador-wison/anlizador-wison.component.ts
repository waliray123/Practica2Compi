import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { parse } from 'node:path';
import { Analizador } from 'src/app/models/Analizador';
import {DbAnalizadoresService} from 'src/app/services/db-analizadores.service';
//var gramatica = require("../../gramaticas/gramatica.js");

@Component({
  selector: 'app-anlizador-wison',
  templateUrl: './anlizador-wison.component.html',
  styleUrls: ['./anlizador-wison.component.scss']
})
export class AnlizadorWisonComponent implements OnInit {
  
  prueba:string = '';
  entrada:string = '';
  gramatica = require("../../gramaticas/gramatica.js");
  
  

  constructor(private dbAnServ:DbAnalizadoresService) { }

  ngOnInit(): void {
    this.prueba = this.dbAnServ.getPrueba();
    //console.log(this.gramatica);
  }

  onSubmit(){
//    this.entrada;
    //this.dbAnServ.setPrueba(this.entrada);
    //this.prueba = this.dbAnServ.getPrueba();
    var parseado = this.gramatica.parser.parse(this.entrada); 
    //var prueba  = this.gramatica.parser.pruebaVar;
    const par = parseado;
    
    console.log(par);
    
  }
}

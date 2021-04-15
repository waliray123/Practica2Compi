import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parse } from 'node:path';
import { ControlAnalizador } from 'src/app/controlers/ControlAnalizador';
import { Analizador } from 'src/app/models/Analizador';
import { ErrorCom } from 'src/app/models/ErrorCom';
import { Lexema } from 'src/app/models/Lexema';
import { NoTerminal } from 'src/app/models/NoTerminal';
import { Produccion } from 'src/app/models/Produccion';
import { Terminal } from 'src/app/models/Terminal';
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
  erroresLexSint : ErrorCom[] = [];
  mensaje : string = '';
  
  

  constructor(private dbAnServ:DbAnalizadoresService, private router:Router) { }

  ngOnInit(): void {
    this.prueba = this.dbAnServ.getPrueba();
    this.gramatica = require("../../gramaticas/gramatica.js");
    this.erroresLexSint = [];
    //console.log(this.gramatica);
  }

  onSubmit(){
//    this.entrada;
    //this.dbAnServ.setPrueba(this.entrada);
    //this.prueba = this.dbAnServ.getPrueba();     
    //var prueba  = this.gramatica.parser.pruebaVar;
    //this.gramatica.reset();
    this.gramatica = require("../../gramaticas/gramatica.js");
    const parseado = this.gramatica.parser.parse(this.entrada);
    const par = parseado;  
    this.pruebaMetodo(par);
  }

  pruebaMetodo(par:{terminales : [], noTerminales:[], producciones:[],initialSim:[],errores:[]}){
    console.log(par);
    
    const cantidadAnalidores = this.dbAnServ.getCantidadAnalizadores();
    //Se crea analizador 
    var analizadorIns = new Analizador();
    const nombreAnalizador = "Analizador No." + (cantidadAnalidores+1);
    //Asignacion de nombre al analizador
    analizadorIns.setNombre(nombreAnalizador);
    //Asignacion de no terminal inicial
    const initialSym = par.initialSim;
    for(let sim of initialSym){
      analizadorIns.setInitialSim(sim);
    }

    //Insertar Errores
    const erroresLexSin = par.errores;
    for(let errorLS of erroresLexSin){
      this.insertarErroresLexSin(errorLS);
    }

    //Insertar nombres noterminales
    const nombreNoTerminales = par.noTerminales;
    for(let nombre of nombreNoTerminales){
      analizadorIns.setNuevoNombreNoTerminal(nombre);
    }

    //Insertar noTerminales
    const producciones = par.producciones;
    for(let produccion of producciones){
      analizadorIns.setNuevoNoTerminal(this.obtenerNoTerminal(produccion));
    }

    //Insertar Terminales
    const terminales = par.terminales;
    for(let term of terminales){
      analizadorIns.setNuevoTerminal(this.obtenerTerminal(term));
    }

    //Revisar Semantica de analizador
    var controlAnalizador = new ControlAnalizador(analizadorIns);
    controlAnalizador.revisarAnalizador();
    var erroresSemanticos = controlAnalizador.getErrores();
    var erroresWison = erroresSemanticos.concat(this.erroresLexSint);
    if(erroresWison.length >= 1){
      this.dbAnServ.setErrores(erroresWison);
      this.router.navigate(["/reporteErrores"]);
    }else{
      this.dbAnServ.addAnalizador(analizadorIns);
      this.mensaje = "El analizador guardado como: "+ analizadorIns.getNombre();;
    }
    
    console.log(analizadorIns);    
    console.log(erroresWison);    
  }

  insertarErroresLexSin(errorLS : string){
    let errorsLS = errorLS.split("||");
    let errorCom = new ErrorCom();
    errorCom.setTipo(errorsLS[0]);
    errorCom.setLexema(errorsLS[1]);
    var lin: number = +errorsLS[2];
    var col: number = +errorsLS[3];    
    errorCom.setLin(lin);
    errorCom.setCol(col);
    errorCom.setDesc(errorsLS[4]);
    this.erroresLexSint.push(errorCom);
  }

  obtenerNoTerminal(produccion : {nombre : string, producciones : string}){
    var noTerminal = new NoTerminal();
    noTerminal.setNombre(produccion.nombre);
    const prodsStr = produccion.producciones.split('|');
    for(let prod of prodsStr){
      var produccionIns = new Produccion();
      const ordenProd = prod.split('+')   
      for(let orden of ordenProd){
        if(orden != ""){
          produccionIns.setNuevaProduccion(orden);
        }        
      }      
      noTerminal.addNuevaProduccion(produccionIns);
    }            
    return noTerminal;
  }

  obtenerTerminal(term : {lexemas : [], nombre : string}){
    var terminal = new Terminal();
    terminal.setNombre(term.nombre);   
    var lexms = term.lexemas; 
    this.obtenerLexemas(lexms,terminal);
    return terminal;
  }

  obtenerLexemas(lexemas : [], terminal : Terminal){    
    var cont = 1;
    for(let lexema of lexemas){
      var esLexema = this.validarSiEsLexema(lexema);
      if(esLexema == true){
        var lexIns = this.obtenerLexema(lexema);    
        var nombreLex = lexIns.getLexema();
        if(nombreLex != ""){
          terminal.addNuevoLexema(lexIns);
        }        
      }else{        
        this.obtenerLexemas(lexema,terminal);
      }
      cont++;
    }
  }

  obtenerLexema(lex: { nombre : string, restr : string}){
    var lexema = new Lexema();
    lexema.setLexema(lex.nombre);
    lexema.setRestriccion(lex.restr);
    return lexema;
  }

  validarSiEsLexema(lex: { nombre : string, restr : string}){
    var esLexema = true;
    if(lex.nombre == undefined){
      esLexema = false;
    }
    return esLexema;
  }
    
}

import { Injectable } from '@angular/core';
import { ErrorCom } from '../models/ErrorCom';
import { Analizador} from '../models/Analizador';

@Injectable({
  providedIn: 'root'
})
export class DbAnalizadoresService {
  analizadores: Analizador[] = [];
  errores: ErrorCom[] = []
  prueba: string = '';

  constructor() { }

  getAnalizadores(){
    return this.analizadores;
  }

  addAnalizador(analizador: Analizador){
    this.analizadores.push(analizador);
  }

  getErrores(){
    return this.errores;
  }

  setErrores(errors: ErrorCom[]){
    this.errores = errors;
  }

  getPrueba(){
    return this.prueba;
  }
  setPrueba(nom:string){
    this.prueba = nom;
  }
}

import { Analizador } from "../models/Analizador";
import { Token } from "../models/Token";
export class AnalizadorSintactico{
    tokens : Token[];
    analizador : Analizador;

    constructor(analizador:Analizador, tokens : Token[]){
        this.analizador = analizador;
        this.tokens = tokens;
    }

    
}
import { Lexema } from "./Lexema";

export class Terminal{
    nombre: string;
    lexemas:  Lexema[];

    constructor(){
        this.nombre = '';        
        this.lexemas = [];
    }

    setNombre(nomb: string){
        this.nombre = nomb;
    }

    addNuevoLexema(lex: Lexema){
        this.lexemas.push(lex);
    }

    getNombre(){
        return this.nombre;        
    }

    getLexemas(){
        return this.lexemas;
    }
    
}
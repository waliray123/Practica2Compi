export class Lexema{
    restriccion : string;
    lexema : string;

    constructor(){
        this.restriccion = "";
        this.lexema = "";
    }

    setRestriccion(rest : string){
        this.restriccion = rest;
    }

    setLexema(lex : string){
        this.lexema = lex;
    }

    getRestriccion(){
        return this.restriccion;        
    }

    getLexema(){
        return this.lexema;
    }
}
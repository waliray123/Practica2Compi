import { Token } from "../models/Token";
import { Analizador } from "../models/Analizador";
import { Lexema } from "../models/Lexema";
import { Terminal } from "../models/Terminal";
import { ErrorCom } from "../models/ErrorCom";

export class AnalizadorLexico{
    entrada : string;
    analizador : Analizador;
    tokens : Token[];    
    numCadEv : number; 
    numLexEv : number;
    numLexEv2 : number; 
    tokenIns : Token;
    tipoEv : string;
    errores : ErrorCom[];
    lexemaTerminado : boolean;
    lin:number;
    col:number;

    constructor(entrada: string, analizador:Analizador){
        this.entrada = entrada;
        this.analizador = analizador;
        this.tokens = [];
        this.errores =[];
        this.numCadEv = 0;
        this.numLexEv = 0;
        this.numLexEv2 = 0;
        this.tokenIns = new Token();
        this.tipoEv = "";
        this.lexemaTerminado = false;
        this.lin = 0;
        this.col = 0;
        this.obtenerTokens();
    }

    getTokens(){
        return this.tokens;
    }

    obtenerTokens(){        
        var largoEntrada = this.entrada.length;
        var nombreTerminal = "";
        var caracter = '';
        for(var i = 0; i < largoEntrada; i++){
            caracter = this.entrada.charAt(i);
            if(caracter == " "){
                this.col++;
                nombreTerminal = "";
            }else if(caracter == "\n"){
                this.lin++;
                this.col = 0;
                nombreTerminal = "";
            }else{
                if(nombreTerminal == ""){
                    nombreTerminal = this.obtenerTerminal(caracter);
                    if(nombreTerminal == ""){
                        // Insertar error lexico -> caracter no existe en la gramatica
                        this.insertarError("Lexico","El caracter: "+  caracter + " no existe en la gramatica","");
                    }else{
                        this.tokenIns = new Token();
                        this.tokenIns.setTerminalUsado(nombreTerminal);
                        this.tokenIns.setLin(this.lin);
                        this.tokenIns.setCol(this.col);
                        this.tokens.push(this.tokenIns);                         
                        this.numCadEv = 0;                                       
                        i--;                    
                    }
                }else{
                    //Evaluando terminal
                    var terminal = this.getTerminalPorNombre(nombreTerminal);
                    var evaluarTerm = this.evaluarTerminal(terminal,caracter);
                    if(evaluarTerm == "regresar"){
                        nombreTerminal = "";
                        i--;
                    }else if(evaluarTerm == "parar"){
                        nombreTerminal = "";
                    }else if(evaluarTerm == "cambioLex"){
                        i--;
                    }else if(evaluarTerm == "cambioLex1"){

                    }else if(evaluarTerm == "seguir"){
                        
                    }                    
                }
            }            
        }
    }

    evaluarTerminal(terminal: Terminal, caracter: string):string{
        const lexemas = terminal.getLexemas();
        const lexema = lexemas[this.numLexEv];
        this.tipoEv = this.getTipoLexema(lexema.getLexema());
        var esCorrecto = this.validarLexemaPorTipo(caracter,lexema,this.tipoEv);
        if(esCorrecto){
            this.tokenIns.agregarCaracterAValor(caracter);
        }else{
            if(this.tipoEv == 'char'){
                const lex = lexema.getLexema();
                var nuevoLex = lex.replace('\‘', '')
                nuevoLex = nuevoLex.replace('\’', ''); 
                const val = this.tokenIns.getValor();
                if(val == nuevoLex){                    
                    //No hay error
                }else{
                    if(lexemas.length > 1 && this.numLexEv < (lexemas.length-1)){
                        this.numLexEv++;
                        
                        return "cambioLex";
                        
                    }else{
                        //Insertar error -> lexema incorrecto lexema incompleto
                        this.insertarError("Lexico","Lexema incorrecto, Lexema incompleto",val);
                    }                    
                }
            }
            return "regresar";
        }


        var restriccion = lexema.getRestriccion();
        if(restriccion == "+"){
            return "seguir";
        }else if (restriccion == "*"){
            return "seguir"
        }else if (restriccion == "?"){
            if(this.tipoEv == 'char'){
                const lex = lexema.getLexema();
                var nuevoLex = lex.replace('\‘', '')
                nuevoLex = nuevoLex.replace('\’', ''); 
                const val = this.tokenIns.getValor();
                if(val == nuevoLex){
                    if(lexemas.length > 1 && this.numLexEv < (lexemas.length-1)){
                        this.numLexEv++;
                        return "cambioLex1";
                        this.lexemaTerminado = false;
                    }else{
                        //Insertar error -> lexema incorrecto lexema incompleto
                        //this.insertarError("Lexico","Lexema incorrecto, Lexema incompleto",val);
                    }
                    return "parar";
                }else{
                    return "seguir";
                }
            }
            return "parar";
        }else{
            if(this.tipoEv == 'char'){
                const lex = lexema.getLexema();
                var nuevoLex = lex.replace('\‘', '')
                nuevoLex = nuevoLex.replace('\’', ''); 
                const val = this.tokenIns.getValor();
                if(val == nuevoLex){
                    if(lexemas.length > 1 && this.numLexEv < (lexemas.length-1)){
                        this.numLexEv++;
                        return "cambioLex1";
                    }else{
                        //Insertar error -> lexema incorrecto lexema incompleto
                        //this.insertarError("Lexico","Lexema incorrecto, Lexema incompleto",val);
                    }
                    return "parar";
                }else{
                    return "seguir";
                }
            }
            return "parar";
        }        
    }

    validarLexemaPorTipo(caracter : string, lexema: Lexema, tipo:string): boolean{
        if(tipo == "alfab"){
            this.tipoEv = "alfab";
            var esLetr = this.esLetra(caracter);
            if(esLetr == true){
                return true;
            }
        }else if(tipo == "numero"){
            this.tipoEv = "numero";
            var esNum = this.esNumero(caracter);
            if(esNum == true){
                return true;
            }
        }else if(tipo == "char"){
            this.tipoEv = "char";
            const lex = lexema.getLexema();
            var nuevoLex = lex.replace('\‘', '')
            nuevoLex = nuevoLex.replace('\’', ''); 
            var primerChar = nuevoLex.charAt(this.numCadEv);
            this.numCadEv++;
            if(this.numCadEv == nuevoLex.length){
                this.numCadEv = 0;
            }
            if(primerChar == caracter){
                return true;
            }
        }else if(tipo == "terminal"){
            this.tipoEv = "terminal";
            var terminal = this.getTerminalPorNombre(lexema.getLexema());
            if(terminal.getNombre() != ""){
                var nombreTerminal = this.validarTerminal(terminal,caracter);
                if(nombreTerminal != ""){
                    return true;
                }
            }
        }
        return false;
    }
    
    obtenerTerminal(caracter : string):string{
        var nombreTerminal = "";
        const terminales = this.analizador.getTodosTerminales();
        for(let terminal of terminales){
            nombreTerminal = this.validarTerminal(terminal,caracter);
            if(nombreTerminal != ""){
                return nombreTerminal;                
            }
        }
        return nombreTerminal;
    }

    validarTerminal(terminal: Terminal, caracter: string):string{
        var lexemas = terminal.getLexemas();
        var cont = 0;        
        for(let lexema of lexemas){
            var primerLexema = lexema;
            var tipoLexema = this.getTipoLexema(primerLexema.getLexema());
            var restriccion = primerLexema.getRestriccion();        
            var esCorrecto = this.validarPrimeLexemaPorTipo(caracter,primerLexema,tipoLexema);        
            if(esCorrecto == true){
                this.numLexEv = cont;
                return terminal.getNombre();           
            }        
            if(restriccion == "?" || restriccion == "*"){
                
            }else{
                break;
            }
            cont++;         
        }
        return "";
    }

    validarPrimeLexemaPorTipo(caracter : string, lexema: Lexema, tipo:string): boolean{
        if(tipo == "alfab"){
            var esLetr = this.esLetra(caracter);
            if(esLetr == true){
                return true;
            }
        }else if(tipo == "numero"){
            var esNum = this.esNumero(caracter);
            if(esNum == true){
                return true;
            }
        }else if(tipo == "char"){
            const lex = lexema.getLexema();
            var nuevoLex = lex.replace('\‘', '')
            nuevoLex = nuevoLex.replace('\’', ''); 
            var primerChar = nuevoLex.charAt(0);
            if(primerChar == caracter){
                return true;
            }
        }else if(tipo == "terminal"){
            var terminal = this.getTerminalPorNombre(lexema.getLexema());
            if(terminal.getNombre() != ""){
                var nombreTerminal = this.validarTerminal(terminal,caracter);
                if(nombreTerminal != ""){
                    return true;
                }
            }
        }
        return false;
    }

    getTerminalPorNombre(nombreTerminal : string): Terminal{
        const terminales = this.analizador.getTodosTerminales();
        for(let terminal of terminales){
            var nombTermEv = terminal.getNombre();
            if(nombTermEv == nombreTerminal){
                return terminal;
            }
        }
        return new Terminal;
    }

    getTipoLexema(nomblexema : string): string{
        var tipo : string = "";
        if(nomblexema == "[aA-zZ]"){            
            return "alfab";
        }else if (nomblexema == "[0-9]"){
            return "numero";
        }else if (nomblexema.charAt(0) == "‘"){
            return "char";
        }else if (nomblexema.charAt(0) == "$"){
            return "terminal";
        }
        return tipo;
    }
    
    esLetra(caracter : string):boolean{        
        let ascii = caracter.toUpperCase().charCodeAt(0);
        if(ascii > 64 && ascii < 91){
            return true;
        }
        return false;
    }

    esNumero(caracter: string):boolean{
        var valoresAceptados = /^[0-9]+$/;
        if(caracter.match(valoresAceptados)){
            return true;
        }else {
            return false;
        }
    }
    
    insertarError(tipo: string,descripcion : string, lexema : string){
        var errorIns = new ErrorCom ()
        errorIns.setTipo(tipo);
        errorIns.setDesc(descripcion);
        errorIns.setLexema(lexema);
        errorIns.setLin(this.lin);
        errorIns.setLin(this.col);
        this.errores.push(errorIns);
    }

    getErrores(){
        return this.errores;
    }
}
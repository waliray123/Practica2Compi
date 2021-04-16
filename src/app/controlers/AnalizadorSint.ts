import { Analizador } from "../models/Analizador";
import { Token } from "../models/Token";
import { NoTerminal } from "../models/NoTerminal";
import { Produccion } from "../models/Produccion";
import { ErrorCom } from "../models/ErrorCom";
import { Arbol } from "../models/Arbol";
import { NodoArbol } from "../models/NodoArbol";
import { NotExpr } from "@angular/compiler";

export class AnalizadorSint{
    esAmbigua : boolean;
    tokens : Token[];
    analizador : Analizador; 
    noTerminales : NoTerminal[];  
    erroresSint : ErrorCom[]; 
    arboles : Arbol[];
    arbolUsado : Arbol;
    numTokenEv : number;
    numTokenEv2 : number;
    cantidadTokens : number;


    constructor(analizador:Analizador, tokens : Token[]){
        this.esAmbigua = false;
        this.analizador = analizador;
        this.tokens = tokens;
        this.noTerminales = this.analizador.getNoTerminales();
        this.erroresSint = [];
        this.arbolUsado = new Arbol();
        this.arboles = [];
        this.numTokenEv = 0;
        this.numTokenEv2 = 0;
        this.cantidadTokens = tokens.length-1;
        this.analizar();
    }

    analizar(){
        var initialSim = this.analizador.getInitialSim();
        let noTerminalInicial = this.getNoTerminalPorNombre(initialSim); 
        let produccionesIniciales = noTerminalInicial.getProducciones();               
        const tokenInicial = this.tokens[0];
        var numProdEv = 0;
        var numProducciones = this.getProduccionesTokenEntra(tokenInicial, noTerminalInicial, "",0);
        if(numProducciones.length > 1){
            //reducir a una produccion
            var nodoRaiz = new NodoArbol();
            nodoRaiz.insertarValor(initialSim);
            this.arbolUsado.insertarRaiz(nodoRaiz);             
            this.arboles.push(this.arbolUsado);         
            var esEliminado = this.reducirAUnpaProduccion(numProducciones, this.arbolUsado, noTerminalInicial,this.numTokenEv);
            if(esEliminado == true){
                //Ya no lo termine asi que se vaya
            }
        }else if(numProducciones.length == 0){
            //InsertarError -> No hay producciones que utilicen el token 
            this.insertarError("Sintactico","No hay producciones que utilicen el lexema",tokenInicial.getValor(),tokenInicial.getLin(),tokenInicial.getCol());
        }else{
            var nodoRaiz = new NodoArbol();
            nodoRaiz.insertarValor(initialSim);
            this.arbolUsado.insertarRaiz(nodoRaiz);
            let produccion = produccionesIniciales[numProducciones[0]];   
            this.arboles.push(this.arbolUsado);         
            this.seguirEvaluando(produccion, nodoRaiz);    
            if(this.numTokenEv == this.cantidadTokens){
                //No hay error
            }else{
                if(this.numTokenEv2 == this.cantidadTokens){
                    //No hay error
                }else{
                    for(var i = this.numTokenEv; i <= this.cantidadTokens; i++ ){
                        this.insertarError("Sintactico","Lexema extra",this.tokens[i].getValor(),this.tokens[i].getLin(),this.tokens[i].getCol());
                    }
                }
            }
        }

    }    

    seguirEvaluando(produccion: Produccion, nodoIns : NodoArbol){
        const ordenProducciones = produccion.getOrdenProducciones();        
        for(let ord of ordenProducciones){
            const tipo = this.getTipoProduccion(ord);
            if(tipo == "terminal"){
                
                if(this.cantidadTokens < this.numTokenEv){
                    this.insertarError("Sintactico","Cadena no terminada, Se esperaba : "+ ord,ord
                        ,0,0);
                        return;
                }
                if(ord == this.tokens[this.numTokenEv].getTerminalUsado()){                    
                    var nodoIns2 = new NodoArbol();
                    nodoIns2.insertarPadre(nodoIns);
                    nodoIns2.insertarValor(this.tokens[this.numTokenEv].getValor());
                    nodoIns.insertarNodoHijo(nodoIns2);
                    this.numTokenEv++;
                }else{
                    //Error sintactico -> Token no insertado 
                    this.insertarError("Sintactico","Lexema no coincide con la gramatica",this.tokens[this.numTokenEv].getValor()
                        ,this.tokens[this.numTokenEv].getLin(),this.tokens[this.numTokenEv].getCol());
                }
            }else if (tipo == "noTerminal"){
                var nodoIns2 = new NodoArbol();
                nodoIns2.insertarPadre(nodoIns);
                nodoIns2.insertarValor(ord);
                nodoIns.insertarNodoHijo(nodoIns2);
                this.arbolUsado.insertarNodoAct(nodoIns2);
                var noTerminal =  this.getNoTerminalPorNombre(ord);
                var produccionesNoT = noTerminal.getProducciones();
                var numProducciones = this.getProduccionesTokenEntra(this.tokens[this.numTokenEv], noTerminal, noTerminal.getNombre(),0);
                if(numProducciones.length > 1){
                    //reducir a una produccion
                    let numTok = this.numTokenEv;
                    var esEliminado = this.reducirAUnpaProduccion(numProducciones, this.arbolUsado, noTerminal,numTok);
                    if(esEliminado == true){
                        return;
                    }
                }else if(numProducciones.length == 0){
                    //InsertarError -> No hay producciones que utilicen el token
                    this.insertarError("Sintactico","No hay producciones que utilicen el lexema",this.tokens[this.numTokenEv].getValor()
                        ,this.tokens[this.numTokenEv].getLin(),this.tokens[this.numTokenEv].getCol());
                }else{
                    let produccion = produccionesNoT[numProducciones[0]];            
                    this.seguirEvaluando(produccion,nodoIns2);
                }
            }
        }        
    }

    reducirAUnpaProduccion(numProducciones : number[], arbolPadre: Arbol, noTerminalPadre : NoTerminal, numTok: number): boolean{
        this.numTokenEv2 = numTok;
        let numTok1 = this.numTokenEv2;
        var produccionesNoT = noTerminalPadre.getProducciones(); 
        var eliminarArbolPadre = false;
        for(let numProd of numProducciones){
            let produccion = produccionesNoT[numProd];            
            var arbolNuevo = Object.assign(arbolPadre);
            //var arbolNuevo = arbolPadre;
            var nodoIns = arbolNuevo.getNodoAct();
            var esCorrecto = this.seguirEvaluando2(produccion,nodoIns,arbolNuevo,numTok1);
            if(esCorrecto == true){                
                eliminarArbolPadre = true;
                this.arboles.push(arbolNuevo);
            }
        }
        if(eliminarArbolPadre == true){
            this.eliminarArbol(arbolPadre);
            return true;
        }
        return false;
    }

    eliminarArbol(arbolElim : Arbol){
        var cont = 0;
        for(let arbol of this.arboles){
            if(arbol == arbolElim){
                break;
            }
            cont++;
        }
        this.arboles.splice(cont, 1);
    }

    seguirEvaluando2(produccion: Produccion, nodoIns : NodoArbol, arbolIns: Arbol, numTok : number): boolean{
        this.numTokenEv2 = numTok;
        const ordenProducciones = produccion.getOrdenProducciones();        
        for(let ord of ordenProducciones){
            const tipo = this.getTipoProduccion(ord);
            if(tipo == "terminal"){
                if(this.cantidadTokens < this.numTokenEv2){
                    this.insertarError("Sintactico","Cadena no terminada, Se esperaba : "+ ord,ord
                        ,0,0);
                        return false;
                }
                if(ord == this.tokens[this.numTokenEv2].getTerminalUsado()){                    
                    var nodoIns2 = new NodoArbol();
                    nodoIns2.insertarPadre(nodoIns);
                    nodoIns2.insertarValor(this.tokens[this.numTokenEv2].getValor());
                    nodoIns.insertarNodoHijo(nodoIns2);
                    this.numTokenEv2++;
                }else{
                    return false;
                    //Error sintactico -> Token no insertado 
                    //this.insertarError("Sintactico","Lexema no coincide con la gramatica",this.tokens[this.numTokenEv].getValor(),this.tokens[this.numTokenEv].getLin(),this.tokens[this.numTokenEv].getCol());

                }
            }else if (tipo == "noTerminal"){
                var nodoIns2 = new NodoArbol();
                nodoIns2.insertarPadre(nodoIns);
                nodoIns2.insertarValor(ord);
                nodoIns.insertarNodoHijo(nodoIns2);
                arbolIns.insertarNodoAct(nodoIns2);
                var noTerminal =  this.getNoTerminalPorNombre(ord);
                var produccionesNoT = noTerminal.getProducciones();
                if(this.cantidadTokens < this.numTokenEv2){
                    //this.insertarError("Sintactico","Cadena no terminada, Se esperaba : "+ ord,ord,0,0);
                        return false;
                }
                var numProducciones = this.getProduccionesTokenEntra2(this.tokens[this.numTokenEv2], noTerminal, noTerminal.getNombre(),0);
                if(numProducciones.length > 1){
                    //reducir a una produccion
                    var esEliminado = this.reducirAUnpaProduccion(numProducciones, arbolIns, noTerminal,this.numTokenEv2);
                    if(esEliminado == true){
                        return false;
                    }
                }else if(numProducciones.length == 0){
                    return false;
                    //InsertarError -> No hay producciones que utilicen el token
                    //this.insertarError("Sintactico","No hay producciones que utilicen el lexema",this.tokens[this.numTokenEv].getValor(),this.tokens[this.numTokenEv].getLin(),this.tokens[this.numTokenEv].getCol());

                }else{
                    let produccion = produccionesNoT[numProducciones[0]];            
                    this.seguirEvaluando2(produccion,nodoIns2,arbolIns,this.numTokenEv2);
                }
            }
        }   
        return true;     
    }




    getProduccionesTokenEntra(tokenEv: Token, noTerminalEv: NoTerminal, nombreNoTermAnt: string, numOrdProd : number):number[]{
        var producciones =  noTerminalEv.getProducciones();
        var produccionesEntra = [];
        let cont = 0;
        for(let produccion of producciones){
            var ordenProducciones = produccion.getOrdenProducciones();
            var primeraProduccion = ordenProducciones[numOrdProd];
            var tipoProduccion = this.getTipoProduccion(primeraProduccion);
            if(tipoProduccion == "terminal"){
                if(primeraProduccion == tokenEv.getTerminalUsado()){
                    produccionesEntra.push(cont);
                }
            }else if(tipoProduccion == "noTerminal"){
                let nombreNuevoNoTerm = primeraProduccion;
                if(nombreNuevoNoTerm == nombreNoTermAnt){
                    this.esAmbigua = true;
                    produccionesEntra.push(cont);
                }else{
                    const nuevoNoTerminal = this.getNoTerminalPorNombre(nombreNuevoNoTerm);
                    const produccionesE2 =  this.getProduccionesTokenEntra(tokenEv,nuevoNoTerminal,nombreNuevoNoTerm,0);
                    if(produccionesE2.length > 0 ){
                        produccionesEntra.push(cont);
                    }
                }                
            } 
            cont++;    
        }
        return produccionesEntra;
    }

    getProduccionesTokenEntra2(tokenEv: Token, noTerminalEv: NoTerminal, nombreNoTermAnt: string, numOrdProd : number):number[]{
        var producciones =  noTerminalEv.getProducciones();
        var produccionesEntra = [];
        let cont = 0;
        for(let produccion of producciones){
            var ordenProducciones = produccion.getOrdenProducciones();
            var primeraProduccion = ordenProducciones[numOrdProd];
            var tipoProduccion = this.getTipoProduccion(primeraProduccion);
            if(tipoProduccion == "terminal"){
                if(primeraProduccion == tokenEv.getTerminalUsado()){
                    produccionesEntra.push(cont);
                }
            }else if(tipoProduccion == "noTerminal"){
                let nombreNuevoNoTerm = primeraProduccion;
                if(nombreNuevoNoTerm == nombreNoTermAnt){
                    this.esAmbigua = true;
                    //produccionesEntra.push(cont);
                }else{
                    const nuevoNoTerminal = this.getNoTerminalPorNombre(nombreNuevoNoTerm);
                    const produccionesE2 =  this.getProduccionesTokenEntra2(tokenEv,nuevoNoTerminal,nombreNuevoNoTerm,0);
                    if(produccionesE2.length > 0 ){
                        produccionesEntra.push(cont);
                    }
                }                
            } 
            cont++;    
        }
        return produccionesEntra;
    }


    getNoTerminalPorNombre(nombre : string):NoTerminal{
        var noTerminal = new NoTerminal ();
        for(let noTerm of this.noTerminales){
            if(noTerm.getNombre() == nombre){
                return noTerm;
            }
        }
        return noTerminal;
    }

    getTipoProduccion(nombreProd : string): string{
        var tipo : string = "";
        if(nombreProd.charAt(0) == "%"){
            return "noTerminal";
        }else if (nombreProd.charAt(0) == "$"){
            return "terminal";
        }
        return tipo;
    }
    
    insertarError(tipo: string,descripcion : string, lexema : string, lin : number, col:number){
        var errorIns = new ErrorCom();
        errorIns.setTipo(tipo);
        errorIns.setDesc(descripcion);
        errorIns.setLexema(lexema);
        errorIns.setLin(lin);
        errorIns.setLin(col);
        this.erroresSint.push(errorIns);
    }

    getErrores(){
        return this.erroresSint;
    }

    getArboles(){
        return this.arboles;
    }

    getEsAmbigua(){
        return this.esAmbigua;
    }
}
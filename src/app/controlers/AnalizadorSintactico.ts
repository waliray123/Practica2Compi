import { Analizador } from "../models/Analizador";
import { Arbol } from "../models/Arbol";
import { NodoArbol } from "../models/NodoArbol";
import { NoTerminal } from "../models/NoTerminal";
import { Produccion } from "../models/Produccion";
import { Token } from "../models/Token";
export class AnalizadorSintactico{
    esAmbigua : boolean;
    tokens : Token[];
    analizador : Analizador;    
    noTerminales : NoTerminal[];   
    numTokenEv : number; 
    cantidadTokens : number;
    cantidadTokensUsados : number;
    numOrdProdAct: number;
    arboles : Arbol[];


    constructor(analizador:Analizador, tokens : Token[]){
        this.arboles = [];
        this.numTokenEv = 0;        
        this.cantidadTokensUsados = 0;
        this.numOrdProdAct= 0;
        this.esAmbigua = false;
        this.analizador = analizador;
        this.tokens = tokens;
        this.cantidadTokens = tokens.length;
        this.noTerminales = this.analizador.getNoTerminales();
        this.evaluarEntrada();
    }    

    evaluarEntrada(){
        var initialSim = this.analizador.getInitialSim();
        let noTerminalInicial = this.getNoTerminalPorNombre(initialSim); 
        let produccionesIniciales = noTerminalInicial.getProducciones();               
        const tokenInicial = this.tokens[0];
        var numsProduccionesEntra = this.getProduccionesTokenEntra(tokenInicial, noTerminalInicial, "",0);      
        try {
            for(let prodEntra of numsProduccionesEntra){
                let produccion = produccionesIniciales[prodEntra];
                var arbol = new Arbol();            
                var nodoA = new NodoArbol();
                nodoA.insertarValor(noTerminalInicial.getNombre());
                arbol.insertarRaiz(nodoA);
                this.arboles.push(arbol);
                this.genArbol(produccion,0,arbol);
            }
            console.log(this.arboles); 
        } catch (errorE ) {
            console.error(errorE);
        }              
        //console.log("Num Prodrucciones Entra");
        //console.log(numProduccionesEntra);
    }

    generarArbol(){

    }

    genArbol(produccion : Produccion, numTokenEv: number, arbol : Arbol):string{
        let tokenEv = this.tokens[arbol.getNumTokenEv()];
        let ordensProd = produccion.getOrdenProducciones();        
        for(let ordenProd of ordensProd){            
            var tipoProduccion = this.getTipoProduccion(ordenProd);
            if(tipoProduccion == "noTerminal"){
                var nodoNT = new NodoArbol();
                nodoNT.insertarValor(ordenProd);
                arbol.insertarNodoEnActual(nodoNT);
                arbol.insertarNodoAct(nodoNT);
                let noTerminal = this.getNoTerminalPorNombre(ordenProd);
                let produccionesNoTerminal = noTerminal.getProducciones();
                var numsProduccionesEntra = this.getProduccionesTokenEntra(tokenEv, noTerminal, ordenProd,0);                        
                for(let numProd of numsProduccionesEntra){    
                    const prod = produccionesNoTerminal[numProd];
                    let arbolAux = arbol;            
                    var arbol2 = arbolAux;
                    this.arboles.push(arbol2);
                    var retorno = this.genArbol(prod,arbol.getNumTokenEv(),arbol2);                                        
                    if(retorno == "insertado"){
                        var nodoA = arbol2.getNodoAct();
                        var nodoC = nodoA.getNodoPadre();
                        arbol2.insertarNodoAct(nodoC[0]);
                        numTokenEv++;
                        arbol2.setNumTokenEv(numTokenEv);
                    }                    
                }
            }else if(tipoProduccion == "terminal"){
                if(ordenProd == tokenEv.getTerminalUsado()){
                    var nodoNT = new NodoArbol();
                    nodoNT.insertarValor(ordenProd);
                    arbol.insertarNodoEnActual(nodoNT);
                    return "insertado";
                }else{
                    return "noInsertado";
                }
            }
        }
        return "";
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



    getEsAmbigua(){
        return this.esAmbigua;
    }
}
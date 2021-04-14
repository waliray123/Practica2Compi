import { Analizador } from "../models/Analizador";
import { ErrorCom } from "../models/ErrorCom";

export class ControlAnalizador{
    analizador : Analizador;
    errores : ErrorCom[];

    constructor(analizador : Analizador){
        this.analizador = analizador;
        this.errores = [];
    }

    revisarAnalizador(){                
        this.revisarSimboloInicial();
        this.revisarTerminales();
        this.revisarNoTerminales();
    }

    revisarSimboloInicial(){
        const initialSim = this.analizador.getInitialSim();
        if(initialSim == ''){
            //No hay simbolo inicial en analizador sintactico
            this.insertarError("Semantico", "No hay simbolo inicial en analizador sintactico","");
        }else{
            var initialExiste  = this.validarExistenciaNoTerminal(initialSim);
            if(initialExiste == false){
                this.insertarError("Semantico", "El simbolo inicial: "+ initialSim +" no esta inicializado",initialSim);
            }
        }
    }

    revisarTerminales(){
        const terminales = this.analizador.getTodosTerminales();
        for(let terminal of terminales){
            const lexemas = terminal.getLexemas();
            for(let lexema of lexemas){
                const nombreLex = lexema.getLexema();
                const tipoLex = this.getTipoLexema(nombreLex);
                if(tipoLex == "terminal"){
                    var terminalExiste = this.validarExistenciaTerminal(nombreLex);
                    if(terminalExiste == false){
                        this.insertarError("Semantico", "Simbolo terminal: "+ nombreLex + " no existe","");
                    }
                }
            }
        }
    }

    revisarNoTerminales(){
        const noTerminales = this.analizador.getNoTerminales();
        for(let noTerminal of noTerminales){
            var producciones = noTerminal.getProducciones();
            for(let produccion of producciones){
                const ordenProducciones = produccion.getOrdenProducciones();
                for(let ordenProd of  ordenProducciones){
                    var tipo = this.getTipoProduccion(ordenProd);
                    if(tipo == "noTerminal"){                        
                        var initialExiste  = this.validarExistenciaNoTerminal(ordenProd);
                        if(initialExiste == false){
                            this.insertarError("Semantico", "El No Terminal: "+ ordenProd +" no esta inicializado",ordenProd);
                        }
                    }else if (tipo == "terminal"){
                        var terminalExiste = this.validarExistenciaTerminal(ordenProd);
                        if(terminalExiste == false){
                            this.insertarError("Semantico", "Simbolo terminal: "+ ordenProd + " no existe y  no puede utilizar lo en syntax",ordenProd);
                        }
                    }
                }                
            }
        }
    }

    insertarError(tipo: string,descripcion : string, lexema : string){
        var errorIns = new ErrorCom ()
        errorIns.setTipo(tipo);
        errorIns.setDesc(descripcion);
        errorIns.setLexema(lexema);
        this.errores.push(errorIns);
    }

    validarExistenciaNoTerminal(noTerminal : string) :boolean{
        const nombresNoTerminales = this.analizador.getTodosNombreNoTerminales();
        var initialExiste = false;
        for(let nombre of nombresNoTerminales){
            if(nombre == noTerminal){
                initialExiste = true;
                break;
            }
        }
        return initialExiste;
    }

    validarExistenciaTerminal(nombreTerminal : string): boolean{
        var terminalExiste = false;
        const terminales = this.analizador.getTodosTerminales();
        for(let terminal of terminales){
            var nombreTerminalPrueba = terminal.getNombre();
            if(nombreTerminal == nombreTerminalPrueba){
                terminalExiste = true;
                break;
            }
        }
        return terminalExiste;
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

    getTipoProduccion(nombreProd : string): string{
        var tipo : string = "";
        if(nombreProd.charAt(0) == "%"){
            return "noTerminal";
        }else if (nombreProd.charAt(0) == "$"){
            return "terminal";
        }
        return tipo;
    }
    
    getErrores(){
        return this.errores;
    }
}
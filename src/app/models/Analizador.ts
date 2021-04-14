import { NoTerminal } from "./NoTerminal";
import { Terminal } from "./Terminal";

export class Analizador{
    nombre : string;
    initialSim : string;
    terminales : Terminal[];
    nombreNoTerminales: string[];
    noTerminales: NoTerminal[];
    constructor(){
        this.nombre = "";
        this.initialSim = "";
        this.terminales = [];
        this.nombreNoTerminales = [];
        this.noTerminales = [];
    }
    setNombre(nomb: string){
        this.nombre = nomb;
    }
    getNombre(){
        return this.nombre;
    }

    setInitialSim(initial: string){
        this.initialSim = initial;
    }
    getInitialSim(){
        return this.initialSim;
    }
    
    setNuevoTerminal(terminal: Terminal){
        this.terminales.push(terminal);
    }

    getTodosTerminales(){
        return this.terminales;
    }

    setNuevoNombreNoTerminal(nombre: string){
        this.nombreNoTerminales.push(nombre);
    }
    getTodosNombreNoTerminales(){
        return this.nombreNoTerminales;
    }

    setNuevoNoTerminal(noTerm : NoTerminal){
        this.noTerminales.unshift(noTerm);
    }
    getNoTerminales(){
        return this.noTerminales;
    }
}
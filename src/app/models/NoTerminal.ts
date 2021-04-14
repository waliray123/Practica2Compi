import { Produccion } from "./Produccion";

export class NoTerminal{
    
    nombre: string;
    producciones:  Produccion[];

    constructor(){
        this.nombre = '';        
        this.producciones = [];
    }

    setNombre(nomb: string){
        this.nombre = nomb;
    }

    addNuevaProduccion(produccion: Produccion){
        this.producciones.push(produccion);
    }

    getNombre(){
        return this.nombre;  
    }

    getProducciones(){
        return this.producciones;
    }

}
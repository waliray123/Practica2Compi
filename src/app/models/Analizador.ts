export class Analizador{
    nombre : string;
    constructor(){
        this.nombre = "";
    }
    setNombre(nomb: string){
        this.nombre = nomb;
    }
    getNombre(){
        return this.nombre;
    }
}
export class Produccion{
    ordenProducciones : string[];

    constructor(){
        this.ordenProducciones = [];
    }

    setNuevaProduccion(prod : string){
        this.ordenProducciones.push(prod);
    }
    
    getOrdenProducciones(){
        return this.ordenProducciones;
    }
}
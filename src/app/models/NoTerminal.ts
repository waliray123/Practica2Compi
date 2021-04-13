class NoTerminal{
    
    nombre: string;
    nombreProducciones:  Array<string>;

    constructor(){
        this.nombre = '';        
        this.nombreProducciones = [];
    }

    setNombre(nomb: string){
        this.nombre = nomb;
    }

    addNuevoLexema(nombProd: string){
        this.nombreProducciones.push(nombProd);
    }

    getNombre(){
        return this.nombre;        
    }

    getLexemas(){
        return this.nombreProducciones;
    }

}
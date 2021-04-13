class Terminal{
    nombre: string;
    lexemas:  Array<string>;

    constructor(){
        this.nombre = '';        
        this.lexemas = [];
    }

    setNombre(nomb: string){
        this.nombre = nomb;
    }

    addNuevoLexema(lex: string){
        this.lexemas.push(lex);
    }

    getNombre(){
        return this.nombre;        
    }

    getLexemas(){
        return this.lexemas;
    }
}
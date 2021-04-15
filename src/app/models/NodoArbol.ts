export class NodoArbol{
    nodoPadre : NodoArbol[];
    nodosHijos : NodoArbol[];
    valor : string;

    constructor(){
        this.valor = "";
        this.nodosHijos = [];        
        this.nodoPadre = [];
    }    

    insertarNodoHijo(nodo : NodoArbol){
        this.nodosHijos.push(nodo);
    }

    eliminarUltimoNodoHijo(){
        this.nodosHijos.pop();
    }

    insertarPadre(nodo : NodoArbol){
        this.nodoPadre.push(nodo);
    }

    getNodoPadre(){
        return this.nodoPadre;
    }

    getNodosHijos(){
        return this.nodosHijos;
    }

    insertarValor(val : string){
        this.valor = val;
    }

    getValor(){
        return this.valor;
    }
}
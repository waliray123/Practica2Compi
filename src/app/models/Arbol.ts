import { NodoArbol } from "./NodoArbol";

export class Arbol{
    nodoRaiz : NodoArbol;
    nodoActual : NodoArbol;
    numTokenEv : number;

    constructor(){
        this.nodoRaiz = new NodoArbol();
        this.nodoActual = new NodoArbol();
        this.numTokenEv = 0;
    }

    insertarRaiz(nodoR : NodoArbol){
        this.nodoRaiz = nodoR;
        this.nodoActual = this.nodoRaiz;
    }

    insertarNodoEnActual(nodo : NodoArbol){
        nodo.insertarPadre(this.nodoActual);
        this.nodoActual.insertarNodoHijo(nodo);
    }

    setNodoActualIndex(index : number){
        var hijos = this.nodoActual.getNodosHijos();
        this.nodoActual = hijos[index];
    }

    insertarNodoAct(nodo : NodoArbol){
        this.nodoActual = nodo;
    }

    setNumTokenEv(num:number){
        this.numTokenEv = num;
    }
    getNumTokenEv(){
        return this.numTokenEv;
    }

    getNodoAct(){
        return this.nodoActual;
    }
    


}
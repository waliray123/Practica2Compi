export class Token{
    terminalUsado : string;
    valor : string;
    lin:number;
    col:number;

    constructor(){
        this.terminalUsado = "";
        this.valor = "";
        this.lin = 0;
        this.col = 0;
    }

    getTerminalUsado(){
        return this.terminalUsado;
    }
    setTerminalUsado(nom:string){
        this.terminalUsado = nom;
    }

    getValor(){
        return this.valor;
    }
    setValor(val : string){
        this.valor = val;
    }

    getLin(){
        return this.lin;        
    }
    getCol(){
        return this.col;
    }
    setLin(lin:number){
        this.lin = lin;
    }
    setCol(col:number){
        this.col = col;
    }

    agregarCaracterAValor(caracter : string){
        this.valor = this.valor + caracter;
    }
}
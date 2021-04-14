
export class ErrorCom{
    tipo: string;
    desc: string;
    lin: number;
    col: number;
    lexema: string;

    constructor(){
        this.tipo = '';
        this.desc = '';
        this.lin = 0;
        this.col = 0;
        this.lexema = '';
    }

    setTipo(tipo : string){
        this.tipo = tipo;
    }
    setDesc(desc : string){
        this.desc = desc;
    }
    setLin(lin : number){
        this.lin = lin;
    }
    setCol(col : number){
        this.col = col;
    }
    setLexema(lex : string){
        this.lexema = lex;
    }

}
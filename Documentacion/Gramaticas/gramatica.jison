%lex
%%
[ \r\t\b\f\n]+                                                 {/*Blancos*/}
"Wison"                                             return 'WISON';
"Terminal"                                          return 'TERM_PAL';
"No_Terminal"                                       return 'NO_TERM_PAL';
"Syntax"                                            return 'SYNTAX';
"Lex"                                               return 'LEX';
"Initial_Sim"                                       return 'INITIAL_SIM';
"¿"                                                 return 'PREGI';
"?"                                                 return 'PREGD';
"{"                                                 return 'CORCHI';
"}"                                                 return 'CORCHD';
":"                                                 return 'DOS_PUNT';
";"                                                 return 'PUNT_COMA';
"*"                                                 return 'ASTER';
"+"                                                 return 'SUMA';
"("                                                 return 'PARI';
")"                                                 return 'PARD';
"<-"                                                return 'FLECHA';
"<="                                                return 'FLECHADOB';
"|"                                                 return 'BARRA_VERT';
\$_[a-zA-Z0-9_]+                                    return 'TERMINAL';
\%_[a-zA-Z0-9_]+                                    return 'NO_TERMINAL';
"[aA-zZ]"                                           return 'ALFAB';
"[0-9]"                                             return 'TODOS_NUM';
\‘([a-zA-Z0-9\[\]{}+\-*/:;¿?\%()#]|[!@$>\^,.])+\’   return 'CADENA';
\#([a-zA-Z0-9\[\]{}+\-*/:;¿?\%()#_<>=]|[!@$>\^,.]|[ ])+ {/*Comentario 1*/}
\/\*\*([a-zA-Z0-9\[\]{}+\-*/:;¿?\%()#_<>=]|[!@$>\^,.]|[ \r\n])*\*\/ {/*Comentario 2*/}
/*[ \r]+                                            {/*Blancos}*/
//[ \n]+                                                  {/*Blancos*/}
<<EOF>>                                             return 'EOF';
.					{ errores.push("Lexico ||" + yytext + "|| "+ yylloc.first_line + "|| " + yylloc.first_column + "|| Lexema no detectado");/*console.error("errore lexico");*/}


/lex

/* operator associations and precedence */

%start inicio

%{
        /*Codigo JavaScript incustado*/
        var errores = [];
        var restricciones = [];
        var lexemas = [];
        var terminal = new Object();
        terminal.lexemas = [];
        var noTerminal = new Object();
        var terminales = [];

        var nombreNoTerminales = [];
        var prodNoTerminales = [];
        var produccionNoT = new Object();
        produccionNoT.producciones = [];        
        var initialSim = [];
        var analizador = new Object();        
        analizador.terminales = terminales;
        analizador.noTerminales = nombreNoTerminales;
        analizador.producciones = prodNoTerminales;
        analizador.initialSim = initialSim;
        analizador.errores = errores;

%}

%%
inicio 
        :   WISON PREGI sig PREGD WISON {
                var aux = analizador; 
                analizador = new Object(); 
                 terminal = new Object();
                terminal.lexemas = [];
                 noTerminal = new Object();
                 terminales = [];
                errores = [];
                 nombreNoTerminales = [];
                 prodNoTerminales = [];
                 produccionNoT = new Object();
                produccionNoT.producciones = [];        
                 initialSim = [];
                 //analizador = new Object();        
                analizador.terminales = terminales;
                analizador.noTerminales = nombreNoTerminales;
                analizador.producciones = prodNoTerminales;
                analizador.initialSim = initialSim;
                analizador.errores = errores;
                return aux;}      
        |   error { errores.push("Sintactico ||" + $1 + "||  "+ this._$.first_line + "|| " + this._$.first_column + "|| Wison no declarado");
                var aux = analizador; 
                analizador = new Object(); 
                 terminal = new Object();
                terminal.lexemas = [];
                 noTerminal = new Object();
                 terminales = [];
                errores = [];
                 nombreNoTerminales = [];
                 prodNoTerminales = [];
                 produccionNoT = new Object();
                produccionNoT.producciones = [];        
                 initialSim = [];
                 //analizador = new Object();        
                analizador.terminales = terminales;
                analizador.noTerminales = nombreNoTerminales;
                analizador.producciones = prodNoTerminales;
                analizador.initialSim = initialSim;
                analizador.errores = errores;
                return aux;}
;

sig 
        :   LEX CORCHI DOS_PUNT sigLex DOS_PUNT CORCHD sig
        |   SYNTAX CORCHI CORCHI DOS_PUNT sigSyntax DOS_PUNT CORCHD CORCHD sig
        |
;

sigLex 
        :   TERM_PAL TERMINAL FLECHA cads PUNT_COMA sigLex 
        {terminal.nombre = $2; terminal.lexemas = terminal.lexemas.concat($4);terminales.unshift(terminal); terminal = new Object(); terminal.lexemas = [];}
        |
        | error sigLex { errores.push("Sintactico ||" + $1 + "|| "+ this._$.first_line + "|| " + this._$.first_column + "|| Error en asignacion terminal");}  
        | TERM_PAL error FLECHA cads PUNT_COMA sigLex { errores.push("Sintactico ||" + $1 + "|| "+ this._$.first_line + "|| " + this._$.first_column + "|| No hay nombre de terminal");}  
;

cads 
        :   CADENA rex {lexema = new Object(); lexema.nombre = $1; lexema.restr = $2; $$ = lexema;}
        |   ALFAB rex {lexema = new Object(); lexema.nombre = $1; lexema.restr = $2; $$ = lexema;}
        |   TODOS_NUM rex {lexema = new Object(); lexema.nombre = $1; lexema.restr = $2; $$ = lexema;}
        |   TERMINAL rex {lexema = new Object(); lexema.nombre = $1; lexema.restr = $2; $$ = lexema;}
        |   PARI cads PARD cads {arr1 = [$2]; arr2 = [$4] ; $$ = arr1.concat(arr2);}
        |   {lexema = new Object(); lexema.nombre = ''; lexema.restr = ''; $$ = lexema;} 
        |   error { errores.push("Sintactico ||" + $1 + "|| "+ this._$.first_line + "|| " + this._$.first_column + "|| Cadena Mal declarada");}  

;

rex 
        :   ASTER {$$ = $1}
        |   SUMA {$$ = $1}
        |   PREGD {$$ = $1}
        |   {$$ = ''}    
        |   error { errores.push("Sintactico ||" + $1 + "|| "+ this._$.first_line + "|| " + this._$.first_column + "|| Restriccion mal declarada");}    
;

sigSyntax 
        :   NO_TERM_PAL NO_TERMINAL PUNT_COMA sigSyntax {nombreNoTerminales.unshift($2);}
        |   INITIAL_SIM NO_TERMINAL PUNT_COMA sigSyntax {initialSim.unshift($2);}
        |   NO_TERMINAL FLECHADOB prod PUNT_COMA sigSyntax {produccionNoT.nombre = $1; produccionNoT.producciones = $3 ;prodNoTerminales.unshift(produccionNoT); produccionNoT = new Object();}
        |
;

prod
        :   NO_TERMINAL prod {$$ = $1 +'+'+$2;}
        |   TERMINAL prod {$$ = $1 +'+'+$2;}
        |   BARRA_VERT prod {$$ = $1 + $2;}
        |   {$$ = ''}
;

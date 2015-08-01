function Pieza(){}
Pieza.prototype = new ISgObject();

Pieza.prototype.fill = function fill(){
	var m, ches, action,orden;
	if (this.actions) {
		for (var i in this.actions) {
			delete this.actions[i];
		}
		delete this.actions[i];
	}
	this.actions = {
		libre:{ataque:[],defensa:[],toca:[]},
		tapado:{ataque:[],defensa:[],toca:[]},
		bydirs:{}
	}
	if (this.data) {
		for (var i in this.data) {
			delete this.data[i];
			delete this.encuentros[i];
		}
		delete this.data;
		delete this.encuentros;
	}
	this.data = chess.getMovimientosFrom(this);
	this.encuentros={};
	ches = this.handler.handler;
	this.byindex={};
	this.destinos={};
	this.ataques={};
	this.defensas={};
	
	this.destinos={cant:0,dirs:{}};
	for (var i in this.data) {
		this.encuentros[i]=[];
		// this.destinos[i]=[];
		this.ataques[i]=[];
		this.defensas[i]=[];
		this.actions.bydirs[i]=[];
		orden=0;
		this.destinos.dirs[i]=[];
		for (var j=0; j<this.data[i].length; ++j) {
			d = {};
			d.row = this.data[i][j].row;
			d.col = this.data[i][j].col;
			m = ches.matriz[d.row][d.col];
			d.orden = this.data[i][j].orden;
			d.val = m;
			d.index = 8*d.row+d.col;
			//this.byindex[d.index]=;
			this.actions.bydirs[i].push(d.index);
			tipo='libre';
			if (m==='') {
				if (this.encuentros[i].length) {	// libre tras bloqueo/os
					tipo='tapado';
					action='toca';
				}
				else {														// libre, posible destino
					action='toca';
					
					this.destinos.cant++;
					this.destinos.dirs[i].push(d);
				}
			}
			else {															// bloqueo
				
        if (m*this.value>0) {
					action='defensa';
				}
				else {
					action='ataque';
				}
				if (this.encuentros[i].length) {	// bloqueado tras bloqueo/os
					tipo='tapado';
				}
				else {														// bloque directo (defensa o ataque)
					this[action+'s'][i].push(d);
					this.destinos.cant++;
					this.destinos.dirs[i].push(d);
					
				}
				this.encuentros[i].push(d);
        d.orden=orden++;
			}
			d.dir=i;
			this.actions[tipo][action].push(d)
		}
	}
}

Pieza.prototype.getInfo = function getInfo(ctxt,pnames){
	var info = {};
	var x;
	if (!pnames) pnames=[];
	pnames.push('internalGUID');
	switch(ctxt) {
		case 'ANALISIS_1': 
			pnames.push('row','col','state','color','value');
			x=this;
		break;
		default: x=this; break;
	}
	
	if (pnames && pnames.length && pnames instanceof Array) {
		for (var i=0; i<pnames.length; ++i) {
			if (!info[pnames[i]])
				info[pnames[i]]=x[pnames[i]];
		}
	}
		
	return info;
}

Pieza.prototype.setState = function setState(state){
	if (state.state==0) 
		this.capturar();
	else {
		if (this.state==0) {
			this.state=1;
			this.element.setAttribute('state',1);
		}
		this.remoteMove([state.row,state.col]);
	}
	
}

Pieza.prototype.invertir = function invertir(){
	this.orientacion*=-1;
	if (this.orientacion==1) {
		this.top = (7-this.row)*50+'px';
		this.left = (this.col)*50+'px';
	}
	else {
		this.left = (7-this.col)*50+'px';
		this.top = (this.row)*50+'px';
	}
	this.element.style.top = this.top;
	this.element.style.left = this.left;
	
}


Pieza.prototype.animateMove = function animateMove(noanalize,isBack){
	this.moved++;
	this.element.style.top = this.top;
	this.element.style.left = this.left;
	if(!isBack) {
		this.lastMove.push(this.movedIn)
		this.movedIn = this.handler.getMovedNumber();
  }
	else {
		this.movedIn=this.lastMove.pop();
	}
  if (!noanalize || this.handler.handler.tipoJuego=='1x1') {
    analizer.showAllAtacados(this.color=='blancas'?'blanco':'negro');
    //analizer.analize(this.color=='blancas'?'blanco':'negro');
  }
}


Pieza.prototype.capturar = function capturar(to){
  this.state=0;
	this.element.setAttribute('state',0);
	this.lastCol=this.col;
	this.lastRow=this.row;
  this.col=-1;
  this.row=-1;

}

Pieza.prototype.remoteMove = function remoteMove(to,isBack){
	this.row=to[0];
	this.col=to[1];
	var orientacion = this.orientacion==this.handler.orientacion?this.handler.orientacion:this.orientacion;
	if (orientacion==1) {
		this.top = 50*(7-this.row)+'px';
		this.left = 50*this.col+'px';
	}
	else {
		this.top = 50*this.row+'px';
		this.left = 50*(7-this.col)+'px';
	}
	this.animateMove(true,isBack);
	
}

Pieza.prototype.mouseUp = function mouseUp(e,o,c){
	var ok=false;
	for (var i=0; i<this.pintados.length; ++i) {
		if (c.id == this.pintados[i]) {
			ok=true;
			break;
		}
	}
	for (var i=0; i<this.pintados.length; ++i) {
		d = document.getElementById(this.pintados[i]);
		if (d) d.style.border='solid 1px black';
	}
	if (ok) {
		from = [this.row,this.col];
		
		var orientacion;
		
		orientacion=this.orientacion==this.handler.orientacion?this.handler.orientacion:this.orientacion;
		
		var r, c;
		r=+c.parentNode.getAttribute('row');;
		c=+c.getAttribute('col');
		var rrr,ccc;
		if (orientacion==1) {
			rrr = 7-r;
			ccc = c;
		}
		else {
			rrr = r;
			ccc = 7-c;
		}
		if(this.handler.handler.checkUnredo(from,[rrr,ccc])){
			return;
		}
		this.row=rrr;
		this.col=ccc;
		if (!this.handler.handler.move(from,[this.row,this.col])) {
			this.row = from[0];
			this.col = from[1];
		
		}
		else {
			if (orientacion==1) {
				this.top = 50*(7-this.row)+'px';
				this.left = 50*(this.col)+'px';
			}
			else {
				this.top = 50*this.row+'px';
				this.left = 50*(7-this.col)+'px';
			}
			this.animateMove();
		}
	}
	this.pintados = [];
}

Pieza.prototype.getCells = function getCells(){
  var r,c, o, d;
  this.destinos ={};
  this.defensas ={libres:[], tapados:[]};
  this.ataques ={libres:[], tapados:[]};
  this.ataques ={};
  this.ocupaciones ={};
  var ataques={};
	var ocupados=[];
  var defensas={};
  var or=0;
  var ocupaciones={libres:[], tapados:[]};
  var tt=0,tipo;
  for (var i=0; i<this.dirs.length;++i) {
    r=this.row;
    c=this.col;
    d=this.idirs[i];
		or=0;
    if (!this.destinos[d]) this.destinos[d]=[];
    if (!defensas[d]) defensas[d]={libre:[], tapado:[]};
    if (!ataques[d]) ataques[d]={libre:[], tapado:[]};
    if (!ocupaciones[d]) ocupaciones[d]={libre:[], tapado:[]};
    // if (!this.defensas[d) this.defensas[d]=[];
    // if (!this.ataques[d) this.ataques[d]=[];
    // if (!this.ocupaciones[d) this.ocupaciones[d]=[];
    
    while(1) {
      r+=this.dirs[i][0];
      if (r<0 || r>7) break;
      c+=this.dirs[i][1];
      if (c<0 || c>7) break;
      
      o={
        row:r, col:c
      }
      o.val=this.handler.handler.matriz[o.row][o.col];
      o.cell = {
        ocupado: o.val==='',
        propio: o.val*this.value>0,
        orden:or,
				ocupados:ocupados.length
      }
      
      if (o.cell.ocupado) {
				if (ocupados.length) {
					ocupados.push(destinos.idirs[i].length)
				}
				else {
					ocupados.push(destinos.idirs[i].length)
				}
				
				
					destinos.idirs[i].push(o);
				
				
				if (o.cell.propio) {
				o.dataocupa = []
				o.ocupados++;
			}
			
  //      o.ocupado=false;
//        // o.accion = 'ocupa';
//       ocupaciones[d].libre.push(O);
      }
      else {
        if (o.val*this.value<0) {
            v='ataques';
        }
        else {
          // o.accion = 'defensa'
          v='defensas';
        }
      }
      tt = ocupaciones[d].length;
        
        if (tt==0) {
          tipo='libre'
        }
        else {
          tipo='tapado';
        }
        this[v][tipo]. v[tipo].push(o)
        v[tipo].push(o)
        
        if (this.ataques[d].length) {
        
        }
//          ataques.libre.push(o)
      }
      
		this.destinos[this.idirs[i]].push(o);
  }
    
  
}

Pieza.prototype.clean = function clean(){
  this.setOriginalState();
  this.setState({state:0})
}

Pieza.prototype.setOriginalState = function setOriginalState(os){
  if (os) {
    os.row = 7-os.row
    for (var i in os) {
      this.originalState[i]=os[i];
    }
    if (os.row) {
      this.originalState.top = (7-os.row)*50+'px';
    }
    if (os.col);
      this.originalState.left = os.col*50+'px';
  }
  this.state = this.originalState.state;
  this.row = this.originalState.row;
  this.col = this.originalState.col;
  this.top = this.originalState.top;
  this.left = this.originalState.left;
  this.moved = this.originalState.moved;
  this.movedIn = this.originalState.movedIn;
  this.orientacion = this.originalState.orientacion;
  this.element.setAttribute('state',this.state);
  this.element.style.top = this.top;
	this.element.style.left = this.left;  
}

Pieza.prototype.mouseDown = function mouseDown(e,o){
  //chess.startCapturer()
	if (manageSessions.get('login')!=this.user) {
		if (!(this.user===null && this.handler.handler.tipoJuego=='1x1'))
			return;
	}
	if (this.handler.handler.turno != this.color) {
		// if ((this.color=='blancas' && this.handler.handler.jugada%2==1) ||
			 // (this.color=='negras' && this.handler.handler.jugada%2==0))
		return;
	}
	var m = this.handler.handler.getMovimientos(this);
	this.selected=true;
	this.pintados=[];
	var d;
	var r,c;
	var orientacion;
	//if (this.orientacion==1 && this.handler.orientacion==1 )
	orientacion=this.orientacion==this.handler.orientacion?this.handler.orientacion:this.orientacion;
	for (var i=0; i<m.length; ++i) {
		r=orientacion==1?7-m[i][0]:m[i][0];
		c=orientacion==1?m[i][1]:7-m[i][1];
		//this.pintados.push(this.idcasilla+m[i][0]+'_'+m[i][0]);
		this.pintados.push(this.idcasilla+r+'_'+c);
		d = document.getElementById(this.pintados[this.pintados.length-1]);
		if (d) d.style.border='solid red';
	}
	this.handler.handler.capturer(this);
}

Pieza.prototype.init = function init(eargs,oargs){
	this.pintados=[];
	this.movedIn=-10;
	eargs = eargs || {}
	var color = oargs.color == 'blancas' ? 'b':'n';
	if (color=='n') eargs.value*=-1;
	eargs.className = 'pieza';
	eargs.pcolor = oargs.color;
	eargs.top = (7-eargs.fila)*50+'px';
  var this_=this;
	eargs.imgsrc = 'images/'+eargs.name+color+'.png';
	eargs.left = eargs.columna*50+'px';
	eargs.parentNode = eargs.parentNode ? eargs.parentNode : $('div.container > div.tablero.grande')[0];
	eargs.oncontextmenu=function(){
//	this.element.children[0].oncontextmenu=function(){
		return this_.handler.handler.onCasillaRightClick(arguments[0],arguments[1],this_);
	}
	// this.element.oncontextmenu=function(){
		// return this_.handler.handler.onCasillaRightClick(arguments[0],this,this_);
	// }
	eargs.onmousedown=function(){
	// this.element.onmousedown = function() {
		if (arguments[0].button!=2)
			return this_.mouseDown(arguments[0],arguments[1]);
		return this_.handler.handler.onCasillaRightClick(arguments[0],arguments[1],this_);
		
		
  }
	// this.element.children[0].onmousedown = function() {
		// if (arguments[0].button!=2)
			// return this_.mouseDown(arguments[0],this.parentNode);
		// return this_.handler.handler.onCasillaRightClick(arguments[0],this.parentNode,this_);
		
		
  // }
	this.element = sgCreateNode('DIV', eargs);
  ISgObject.prototype.init.call(this,oargs);
	
  for (var i in eargs) {
		if (eargs[i] instanceof Function) {
		}
		else {
			this[i]=eargs[i];
		}
	}
	this.moved=0;
	this.lastMove=[]
  this.originalState = {
    'state':this.state,
    'row':this.row,
    'col':this.col,
    'moved':this.moved,
    'movedIn':this.movedIn,
    'orientacion':this.orientacion,
    'top':this.top,
    'left':this.left
  }
}

function IPieza(){}

IPieza.prototype = new Pieza();

function RowChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'torre',
		value: 4,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
		
	}
	
	
	this.init(elemArgs,args);
}

RowChess.prototype = new Pieza();
RowChess.prototype.dirs=[[1,0],[0,1],[-1,0],[0,-1]];
RowChess.prototype.idirs=[1,10,-1,-10];

function BishopChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'alfil',
		value: 3,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	
	this.init(elemArgs,args);
}

BishopChess.prototype = new Pieza();
BishopChess.prototype.dirs=[[1,1],[-1,1],[-1,-1],[1,-1]];
BishopChess.prototype.idirs=[11,9,-11,-9];


function QueenChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'reina',
		value: 5,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	
	this.init(elemArgs,args);
}

QueenChess.prototype = new Pieza();
QueenChess.prototype.dirs=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
QueenChess.prototype.idirs=[1,11,10,9,-1,-11,-10,-9];

function KingChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'rey',
		value: 6,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	this.init(elemArgs,args);
}

KingChess.prototype = new Pieza();
KingChess.prototype.dirs=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
KingChess.prototype.idirs=[1,11,10,9,-1,-11,-10,-9];

function HorseChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'caballo',
		value: 2,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	
	this.init(elemArgs,args);
}

HorseChess.prototype = new Pieza();
HorseChess.prototype.dirs = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];
HorseChess.prototype.idirs = [12,21,19,8,-12,-21,-19,-8];

function PawnChess(){
	var args = arguments[0] || {}
	
	var elemArgs = {
		name: 'peon',
		value: 1,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	var orientacion=(args.handler && args.orientacion==args.handler.orientacion)?args.handler.orientacion:args.orientacion;
	if (orientacion==1) {
		args.dirs=[[1,-1],[1,1],[1,0]];
		args.idirs=[-9,11,1];
	}
	else {
		args.dirs=[[-1,-1],[-1,1],[-1,0]];
		args.idirs=[9,-11,-1];
	}
	this.init(elemArgs,args);
}

PawnChess.prototype = new Pieza();
PawnChess.prototype.dirs=[[1,-1],[1,1],[1,0]];
PawnChess.prototype.idirs=[-9,11,1];
PawnChess.prototype.dirs2=[[-1,-1],[-1,1],[-1,0]];
PawnChess.prototype.idirs2=[9,-11,-1];

PawnChess.prototype.move = function move() {

}

PawnChess.prototype.moves = function moves() {
  
}
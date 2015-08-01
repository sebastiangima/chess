function ILocalChess(){}
ILocalChess.prototype = new IBaseChess()
ILocalChess.prototype.proto='IBaseChess';



ILocalChess.prototype.logTimer = 0;
ILocalChess.prototype.move = function move(from,to,ignore,pasarTurno,force,coronado){
	var  result = this.logMove.apply(this,Array.prototype.slice.call(arguments,0));
	if (this.logTimer) this.logTimer=clearTimeout(this.logTimer);
	(function(cid,args){
		setTimeout(
			function(cid,args){
				chess.logMatrix(cid,args)
			},750
		)
	})(this.chessid,arguments)
	return result;
}


IApertura.prototype.moveFromJugada = function moveFromJugada(n){
	if (chess.chesses[this.chessid].redoBuffer.length) {
		chess.chesses[this.chessid].unredo();
	}
	var i0 = this.jugada-1,
			j0 = (this.color=='blancas')?0:1,
			pieza;

	var jugada = this.jugadas[this.jugada-1][j0];

	var captura=false,
	jaque=false,
	mate=false,
	coronacion=false;
      
	var moves=[];
	
      switch(jugada) {
        case 'O-O':
						moves.push([[7*j0,4],[7*j0,6]]);
						moves.push([[7*j0,7],[7*j0,5]])
        break;
        case 'O-O-O':
						moves.push([[7*j0,4],[7*j0,2]]);
						moves.push([[7*j0,0],[7*j0,3]])
        break;
        default:
					signo = j0==0? 1: -1;
					if (jugada.length==2) {		// movimiento peon
						to = chess.chesses[this.chessid].parseDestino(jugada);
						from =  chess.chesses[this.chessid].getFromByTo(to,'',signo);
						moves.push([from,to]);
					}
					else {
						if (jugada.indexOf('=')>0) {
							coronacion=true;
						}
						else {
							if (jugada.indexOf('x')>0) 
								captura=true;
							aux = jugada.replace(/x/i,'');
							aux = aux.replace(/\+/g,'');
							switch (jugada.length-aux.length) {
								case 0: break;
								case 1: jaque=true; break;
								case 2: mate=true; break;
							}
							jugada=aux;
							to = chess.chesses[this.chessid].parseDestino(jugada.substr(-2));
							
							aux = aux.substring(0,aux.length-2);
							
							from = chess.chesses[this.chessid].getFromByTo(to,aux,signo,captura);
							moves.push([from,to]);
						}
					}
				break;
			}
			for (k=0; k<1; ++k) {
				pieza=chess.chesses[this.chessid].getByCoord(moves[k][0]);
//				chess.chesses[this.chessid].move(moves[k][0],moves[k][1],false,false);
				if (pieza) pieza.remoteMove(moves[k][1]);
			}
	
}


ILocalChess.prototype.moveJugada = function moveJugada(n){
	if (this.timer) this.timer=clearTimeout(this.timer);
	if (this.callNumber==0) {
		this.callNumber=1;
		var this_=this;
		this.timer = setTimeout(function(){
			this_.moveJugada(n)},500);
			return;

		// this.timer = setTimeout("aperturas.move('"+n+"')",500);
		// return;
	}
	else {
		this.callNumber=0;
	}
	var animate = false;
	if (n==1) {
		if (!this.lastJugada) {
			this.color = 'blancas';
			// this.markJugada();
			this.lastJugada=1;
			this.lastColor='blancas';
			animate='animate';
			//chess.startAnimation(this.roomid,this.chessid,'',this.jugadas);
		}
		else {
			if (this.color=='negras') {
				this.color='blancas';
				this.lastColor='negras';
				this.jugada++;
				// this.markJugada();
				this.lastColor='blancas';
				this.lastJugada=this.jugada;
				animate='animate';
			}
			else {
				this.color='negras';
				this.lastColor='blancas';
				// this.markJugada();
				this.lastColor='negras';
				this.lastJugada=this.jugada;
				
				animate='animate';
			}
		}
	}
	else {
		if (this.jugada==1 && (this.lastColor=='blancas' || this.lastColor=='')) {
			return;
		}
			if (this.color=='negras') {
				this.color='blancas';
				this.lastColor='negras';
				// this.markJugada();
				this.lastColor='blancas';
				this.lastJugada=this.jugada;
				animate='redo';
			}
			else {
				this.color='negras';
				this.lastColor='blancas';
				this.jugada--;
				// this.markJugada();
				this.lastColor='negras';
				this.lastJugada=this.jugada;
				animate='redo';
			}
			chess.chesses[this.chessid].redo();
			this.cleanExtras();
			return;
		
	}

	this.move()
	// chess.animateOneEnabled=true; 
	// chess[animate]();
	// chess.animateOneEnabled=false; 
}
ILocalChess.prototype.synchro = function sinchro(){
	piezas = chess.chesses[this.parentChess].getPiezas();
	this.turno = chess.chesses[this.parentChess].turno;
	this.resetMatriz();
	for (var i in piezas) {
		for (var j in piezas[i]) {
			for (var k=0; k<piezas[i][j].length; ++k) {
				this[i].piezas[j][k].pieza.setState({
					row:piezas[i][j][k].pieza.row,
					col:piezas[i][j][k].pieza.col,
					state:piezas[i][j][k].pieza.state
				});
				this[i].piezas[j][k].row=piezas[i][j][k].pieza.row;
				this[i].piezas[j][k].col=piezas[i][j][k].pieza.col;
				this[i].piezas[j][k].state=piezas[i][j][k].pieza.state;
			}
		}
	}
	
}

ILocalChess.prototype.setEditMode = function setEditMode(value){
  this.editing=value;
	if (this.editing) {
		
	}

}

ILocalChess.prototype.restart = function restart(){
	this.setEditMode(false);
	this.resetMatriz();
	for (var i in this.blanco.piezas) {
		for (var j=0; j<this.blanco.piezas[i].length; ++j) {
			pieza = this.blanco.piezas[i][j].pieza;
			if (pieza.state) {
				this.matriz[pieza.row][pieza.col]=pieza.value;
			}
			var st = {state:pieza.state, row:(7-pieza.row), col:pieza.col, moved:0, movedIn:-10}
			pieza.setOriginalState(st)
		}
	}
for (var i in this.negro.piezas) {
		for (var j=0; j<this.negro.piezas[i].length; ++j) {
			pieza = this.negro.piezas[i][j].pieza;
			if (pieza.state) {
				this.matriz[pieza.row][pieza.col]=pieza.value;
			}
			var st = {state:pieza.state, row:(7-pieza.row), col:pieza.col, moved:0, movedIn:-10}
			pieza.setOriginalState(st)
		}
	}	
  
}

ILocalChess.prototype.setChessId = function setChessId(id){
	this.parentChess=id;
  analizer.init(this.roomid,this.chessid);
}



ILocalChess.prototype.init = function init(){
		var d=document.createElement('div');
		d.id = 'localTablero_container_'+arguments[0].roomid+'_'+guid;
		
		d.id = 'localTablero_container';
		d.className = 'localTablero-container';
		arguments[0].eargs.parentNode.appendChild(d);
		
		var dd=document.createElement('div');
		dd.className = 'localTablero-header';
		d.appendChild(dd);

		var dd=document.createElement('div');
		dd.className = 'localTablero-body';
		d.appendChild(dd);
		
		var args = arguments[0];
		args.parentNode = dd;
		args.className = 'container chess localTablero'
		
		var args = {
			eargs:arguments[0].eargs,
			oargs:arguments[0].oargs,
			common:arguments[0].common,
		}
		args.eargs.className='container chess localTablero';
		args.eargs.display='block';
		args.eargs.parentNode=dd;
		args.oargs.innited=true;
		if (!args.oargs.orientacion) args.oargs.orientacion=1;
		if (!args.oargs.chessid) args.oargs.chessid=this.roomid+'_';
		args.oargs.lastUpdate=0;
		args.oargs.tipoJuego = '1x1';
		window[ILocalChess.prototype.proto].prototype.init.call(this,args);
	
	//var d

	this.turno = 'blancas';
	var piezas = this.acomodar();
	if (!this.chessid) {this.chessid = 'localTablero_chessid_'+guid};
	
	this.blanco = new Player( {idcasilla:this.idcasilla,handler:this, piezas:piezas['blancas'], parentNode: this.tablero.element, chessid: this.chessid, name: this.user, orientacion:1, color:'blancas'});
  this.negro = new Player( {idcasilla:this.idcasilla,handler:this,piezas:piezas['negras'], parentNode: this.tablero.element, chessid: this.chessid, name: this.user, orientacion:-1, color:'negras'});


//	this.acomodar();
}

function LocalChess(){
	this.init(arguments[0])
}
LocalChess.prototype = new ILocalChess();
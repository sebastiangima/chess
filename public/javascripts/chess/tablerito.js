function ITablerito(){}
ITablerito.prototype = new IBaseChess()
ITablerito.prototype.proto='IBaseChess';

ITablerito.prototype.getElement = function getElement(e,o){
	switch(e) {
		case 'CONTAINER': 
			rooms.rooms[this.roomid].element.querySelector('div.tableritos>div[tablero="'+this.tableroNumero+'"]');
		break;
		
		default: return window[ITablerito.prototype.proto].prototype.getElement.call(this,e,o)
	}
}

ITablerito.prototype.deactivate = function deactivate(){
		this.active=false;
		var st=+this.realContainer.getAttribute('state');
		st++;
		st=3;
		domHelper.mapToElement(this.realContainer,{'z-index':5,state:st});
//		this.realContainer.style.zIndex=5;
		this.realContainer.parentNode.style.zIndex=5;
		if (this.handler && this.handler.onDeactivation) {
			this.handler.onDeactivation(this);
		}
}



ITablerito.prototype.setActive = function setActive(){
	
		this.active=true;
		this.realContainer.style.zIndex=15;
		var r=this.realContainer.getClientRects()[0];
		var next=this.handler.nextTablerito(this);
		var st=1;
		if(next) {
			var rn=next.realContainer.getClientRects()[0];
			var r=this.realContainer.getClientRects()[0];
			if(rn.top>r.top)
				st=5;
		}
		st=1;
		domHelper.mapToElement(this.realContainer,{'z-index':16,state:st});
		domHelper.mapToElement(this.realContainer,{top:r.top+'px',left:r.left+'px'});
		
		
		if (this.handler && this.handler.onActivation) {
			this.handler.onActivation(this);
		}
		
//		this.realContainer.parentNode.style.zIndex=16;
//		window[ITablerito.prototype.proto].prototype.activate.call(this);
		
}

ITablerito.prototype.activate = function activate(){
	chess.setActiveChess(this.chessid);
	
}

ITablerito.prototype.move = function move(from,to,ignore,pasarTurno,force){
	return ILocalChess.prototype.move.call(this,from,to,ignore,pasarTurno,force);
	var original;
	var letra='', column='', fila='', separador='', sjaque='', sjm='', el='', ec='', oto;
	original = this.matriz[to[0]][to[1]];
	oto=[to[0],to[1]];
	
var capturada=null;
	if (coronado) {
		from = coronado.from;
		to = coronado.to;
		ignore = coronado.ignore;
		pasarTurno = coronado.pasarTurno;
		force = coronado.force;
		color = coronado.color;
		c2 = coronado.c2;
		original = coronado.original;
		vj = coronado.vj;
	}
	
	if (!ignore) {
		if (!coronado) {}
		if (this.matriz[from[0]][from[1]]==6 || this.matriz[from[0]][from[1]]==-6) {
			switch (to[1]-from[1]) {
				case 2:
				case -2:
					if (to[1]==1 || to[1]==6)
						letra='O-O';
					else
						letra='O-O-O';
				break;
			}
			
		}

	

		this.matriz[to[0]][to[1]]=this.matriz[from[0]][from[1]];
		this.matriz[from[0]][from[1]]='';
		var color = (this.matriz[to[0]][to[1]]>0) ? 'blancas' : 'negras';
		var c2 = '';
		if (color=='blancas') {
			c2= 'negras';
			
		}
		else
			c2 = 'blancas';
		if (this.isJaque(color,to)) {
			this.matriz[from[0]][from[1]]=this.matriz[to[0]][to[1]];
			this.matriz[to[0]][to[1]]='';
			return false;
		}
		// if (color=='blancas') {
			 ;
			// var p = document.getElementsByClassName('jugadas')[0];
			// var pp=document.createElement('DIV');
			// pp.innerHTML=this.jugada+'.';
			// p.children[0].appendChild(pp);
		// }
		var valor = this.matriz[to[0]][to[1]];
		var cols = ['a','b','c','d','e','f','g','h'];
		if (valor<0) valor=-valor;
		if (!letra) {
		
			if (this.orientacion==-1) {
				from[0]=7-from[0];
				from[1]=7-from[1];
				to[0]=7-to[0];
				to[1]=7-to[1];
			}
			switch(valor) {
				case 1: 
					if (original!='') {
						letra = cols[from[1]]+(from[0]+1);
					}
				break;
				case 2: letra='C'; break;
				case 3: letra='A'; break;
				case 4: letra='T'; break;
				case 5: letra='D'; break;
				case 6: letra='R'; break;
			}
			column = cols[to[1]];
				
			fila = to[0]+1;
			if (original!='')
				separador='x';
			// if (this.orientacion==-1) {
			letra = letra + separador + column + fila;
		}
		
		var jugador = color=='blancas'?'blanco':'negro';
		var rr=0, rc;
		var pieza = this[jugador].piezas.king[0].pieza;
		if (letra=='O-O' || letra=='O-O-O'){
			
			if (pieza.col>4) {
				rc=7;
			}
			else rc=0;
			if (this[jugador].piezas.row[0].pieza.state!=0 && this[jugador].piezas.row[0].pieza.col==rc && this[jugador].piezas.row[0].pieza.row==pieza.row) 
				rr=0;
			else
				rr=1;
			var prc;
			if (rc==0) prc=pieza.col+1;
			else prc = pieza.col-1;
			var to2=[pieza.row,prc];
			var from2=[pieza.row,rc];
			this.move(from2,to2,false,true);
			this[jugador].piezas.row[rr].pieza.remoteMove(to2);
				
		}

			
		var vj = {chessid: this.chessid, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
		c2 = (color == 'blancas')?'negras':'blancas';

		var vj = {chessid: this.chessid, 'from': from, 'to': to, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
		this.jugadaInfo.push(vj);
		if (original) {
			 this.capturarPieza(original,oto);
		 }
		this.setTurno(c2);
		
		this.yellowRemark();
		
		if (this.inJaque){
			this[this.inJaque].piezas.king[0].pieza.element.style.backgroundColor='transparent';
			this.inJaque = '';
			
		}
		this.jugada++

		return true;
	}
	else {
		var jugador, valor;
		if (this.orientacion==-1) {
			from[0]=7-from[0];
			from[1]=7-from[1];
			to[0]=7-to[0];
			to[1]=7-to[1];
		}
		// valor = this.matriz[from[0]][from[1]];

		var pieza = this.getByCoord(from);
		if (pieza) {
			pieza.remoteMove(from);
		}
		this.matriz[to[0]][to[1]]=this.matriz[from[0]][from[1]];
		this.matriz[from[0]][from[1]]='';
		var color = (this.matriz[to[0]][to[1]]<0) ? 'blancas' : 'negras';
		this.setTurno(color);

		if (original) {
			 this.capturarPieza(original,oto);
		}
		this.yellowRemark(this.idcasilla+to[0]+'_'+to[1]);
		var vj = {chessid: this.chessid, 'from': from, 'to': to, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
		this.jugadaInfo.push(vj);
	}
	this.jugada++
}

ITablerito.prototype.setTurno = function setTurno(color){
    this.turno=color;
		if (this[color]==this.user) {
      $('.container.chess')[0].setAttribute('active',color);
    }
    else
      $('.container.chess')[0].setAttribute('active',0);
		
		//rooms.rooms[this.roomid].setTurno(this.chessid,this[color.toUpperCase()]);
  }


ITablerito.prototype.synchro = function sinchro(){
	var piezas = chess.chesses[this.parentChess].getPiezas();
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
				if ((this[i].piezas[j][k].row>=0 && this[i].piezas[j][k].row<=7) &&
				   (this[i].piezas[j][k].col>=0 && this[i].piezas[j][k].col<=8))
						this.matriz[this[i].piezas[j][k].row][this[i].piezas[j][k].col]=this[i].piezas[j][k].pieza.value;
			}
		}
	}
	// var vj=chess.chesses[this.parentChess].panelJugadas;
	this.synchroPanelJugadas(chess.chesses[this.parentChess]);
	
	
}
ITablerito.prototype.synchroPanelJugadas = function synchroPanelJugadas(master){
	while(this.jugadas.length) 
		delete this.jugadas.pop()
	while(this.jugadaInfo.length)  {
		var info=this.jugadaInfo.pop()
		while(this.jugadaInfo.length) {
			delete this.jugadaInfo.pop()
		}

	}
	for(var i=0; i<master.jugadas.length; ++i) {	// cada turno
		if (!master.jugadas[i]) continue;
		if(master.jugadas[i] instanceof String || typeof(master.jugadas[i]) == "string") {
			this.jugadas.push(master.jugadas[i])
		}
		else 
			this.jugadas.push(master.jugadas[i][0],master.jugadas[i][1])
	}
	this.jugada=master.jugada;
	var color={blancas:'blanco',negras:'negro'}
	var names=['','pawn','horse','bishop','row','queen','king'];
	for(var i=0; i<master.jugadaInfo.length; ++i) {	// cada turno
		var vij=master.jugadaInfo[i];
	
		for(var j=0; j<vij.length; ++j) {						// movimientos compuestos (enroque)
			var info = vij[j];
			var _info={};
			for(var k in info) {											// propiedades de la jugada
				switch(k) {									// propiedades que no pueden cambiarse
					case 'chessid':
						_info[k]=this.chessid;
						continue;
					break;
					case 'capturada':
						if(!info[k]) {
							_info[k]=null;
							continue;
							
						}
						var pcap=info[k];
						var abs = pcap.value;
						if (abs<0) abs=-abs;
						
						var vp=this[color[pcap.color]].piezas[names[abs]]
						var pn=pcap.id.replace(/^.*(_[0-9]+)$/,"$1") 
						capturada=null;
						for(var l=0; l<vp.length; ++l) {
							if(vp[l].id.endsWith(pn)){
								capturada=vp[l];
								break;
								
							}
							
						}
						_info[k]=capturada;
						
						continue;
					break;
				}
				if(info[k]===undefined || info[k] === null) {
					_info[k]=info[k];
					continue;
				}
				else {
					switch(typeof(info[k])) {
						case 'number':
						case 'string':
						case 'boolean':
							_info[k]=info[k]
							continue;
						break;
					}
				}
				if(info[k] instanceof Array) {
					_info[k]=[].concat(info[k]);
				}
				else 
					_info[k]=info[k];
			}
		}
	}
	//	delete this.jugadas.pop()
	this.panelJugadas.set(chess.chesses[this.parentChess].panelJugadas);
}

ITablerito.prototype.setChessId = function setChessId(id){
	this.parentChess=id;
}


ITablerito.prototype.init = function init(){
		var d=document.createElement('div');
		d.className = 'tablerito-container';
		this.realContainer=d;
		this.tableroNumero = arguments[0].eargs.parentNode.children.length/2;
		d.setAttribute('tablero',this.tableroNumero);
		arguments[0].eargs.parentNode.appendChild(d);
		
		var dd=document.createElement('div');
		dd.className = 'tablerito-header';
		d.appendChild(dd);

		var dd=document.createElement('div');
		dd.className = 'tablerito-body';
		d.appendChild(dd);
		
		var args = arguments[0];
		args.parentNode = dd;
		args.className = 'container chess tablerito'
		
		var args = {
			eargs:arguments[0].eargs,
			oargs:arguments[0].oargs,
			common:arguments[0].common,
		}
		args.eargs.className='container chess tablerito';
		args.eargs.display='block';
		args.eargs.parentNode=dd;
		args.oargs.innited=true;
		args.oargs.orientacion=1;
		args.oargs.jugada=0;
		args.oargs.lastUpdate=0;
		args.oargs.scaled=2;
		args.oargs.tipoJuego='1x1';
		
		window[ITablerito.prototype.proto].prototype.init.call(this,args);
		

	this.turno = 'blancas';
	var piezas = this.acomodar();
	
	if (this.chessid) {this.chessid = 'tablerito_chessid_'+guid};
	
	
	this.blanco = new Player( {idcasilla:this.idcasilla,handler:this,piezas:piezas['blancas'], parentNode: this.tablero.element, chessid: this.chessid, name: this.user, orientacion:1, color:'blancas'});
  this.negro = new Player( {idcasilla:this.idcasilla,handler:this,piezas:piezas['negras'], parentNode: this.tablero.element, chessid: this.chessid, name: this.user, orientacion:-1, color:'negras'});
	
}

function Tablerito(){
	this.init(arguments[0])
}
Tablerito.prototype = new ITablerito();
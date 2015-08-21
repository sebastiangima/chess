function IBaseChess(){}

IBaseChess.prototype = new ISgControl()
IBaseChess.prototype.proto='ISgControl';
IBaseChess.prototype.lastAction;
IBaseChess.prototype.orientacion;
IBaseChess.prototype.matriz = [];
IBaseChess.prototype.blanco = {};
IBaseChess.prototype.negro = {};

IBaseChess.prototype.checkUnredo = function checkUnredo(from,to){
	if(!this.redoBuffer.length)
		return false;
	var rb=this.redoBuffer[this.redoBuffer.length-1];
	if(rb[0].to[0]==to[0] &&
			rb[0].to[1]==to[1] &&
			rb[0].from[0]==from[0] &&
			rb[0].from[1]==from[1] ) {
		this.unredo();
		return true;
	}
		return false;
}
IBaseChess.prototype.unredo = function redo(){
	if(this.redoBuffer.length) {
		var info = this.redoBuffer.pop(), pieza;
		if (info) {
			this.jugadaInfo.push(info);
			for (var i=0; i<info.length; ++i) {
				if (info[i].capturada)
					info[i].capturada.capturar();
				pieza = this.getByCoord(info[i].from);
				pieza.remoteMove(info[i].to);
				this.matriz[info[i].to[0]][info[i].to[1]]=this.matriz[info[i].from[0]][info[i].from[1]]
				this.matriz[info[i].from[0]][info[i].from[1]]='';
			}
			this.setTurno(info[0].color=='blancas'?'negras':'blancas');
			this.jugada++;
		}
		this.panelJugadas.moveMark();
	}
}

IBaseChess.prototype.redo = function redo(){
	var info = this.jugadaInfo.pop();
	if (!this.borrar);
	this.redoBuffer.push(info);
	this.jugada--;
	
	for (var i=0; i<info.length; ++i) {
		var pieza = this.getByCoord(info[i].to);
		pieza.remoteMove(info[i].from,true);
		pieza.moved-=2;
		this.setTurno(info[i].color);
		if (info[i].capturada) {
			info[i].capturada.state=1;
			info[i].capturada.element.setAttribute('state',1); 
			if(info[i].alpaso) {
					info[i].capturada.row=info[i].originalCapturedState.row
					info[i].capturada.col=info[i].originalCapturedState.col
	

				}
				else {

					info[i].capturada.row=info[i].to[0];
					info[i].capturada.col=info[i].to[1];
				}
	
		}
		if (this.animating) {
			if (--chess.animateParams.j0<0) {
				chess.animateParams.j0=1;
				--chess.animateParams.i0;
			}
		}
		this.matriz[info[i].from[0]][info[i].from[1]]=this.matriz[info[i].to[0]][info[i].to[1]];
		if(info[i].alpaso){
			this.matriz[info[i].capturada.row][info[i].capturada.col]=info[i].capturada.value
			this.matriz[info[i].to[0]][info[i].to[1]]='';
		}
		else
			this.matriz[info[i].to[0]][info[i].to[1]]=info[i].captura;
		}
		// if(info[0].jugada.indexOf('O-O')==0) {
			// var r=info[0].from[0];
			// var c=info[0].to>4?info[0].to[1]-1:info[0].to[1]+1;
			// var pieza = this.getByCoord([r,c]);
			// var c1=c>4? 7:0;
			// pieza.remoteMove([r,c]);
			// this.matriz[r][c1]=this.matriz[r][c]
			// this.matriz[r][c]='';
			
		// }
	if (this.borrar) {
		this.panelJugadas.setJugadas(this.jugadas);
		this.borrar=false;
	}
	else {
		this.panelJugadas.moveMark();
		
	}
	
}


IBaseChess.prototype.endDeactivation = function endDeactivation(){
		domHelper.mapToElement(this.realContainer || this.element,{state:0});
		chess.endDeactivation();
}

IBaseChess.prototype.endActivation = function endActivation(){
		var r=this.realContainer || this.element;
		var st=+r.getAttribute('state');
		st=2;
		domHelper.mapToElement(r,{state:st});
}

IBaseChess.prototype.checkUpdateJugada = function checkUpdateJugada(vj){ 
	if(this.redoBuffer && this.redoBuffer.length) {
		var rb=this.redoBuffer[this.redoBuffer.length-1];
		if(rb[0].to[0]!=vj.to[0] ||
			rb[0].to[1]!=vj.to[1] ||
			rb[0].from[0]!=vj.from[0] ||
			rb[0].from[1]!=vj.from[1] ) {
				var vv=this.jugadas.splice(this.jugadaInfo.length-1);
				this.redoBuffer.splice(this.redoBuffer.length-vv.length)
				var info = this.jugadaInfo[this.jugadaInfo.length-1][0];
				if (!info.jugada && vj.jugada)
					info.jugada = vj.jugada;
				if (vj.color) info.color=vj.color;
				this.jugadas.push(vj.jugada);
				this.panelJugadas.setJugadas(this.jugadas);	
				return;
		}
	}
	
 this.updateJugada(vj);
 }

IBaseChess.prototype.logMove= function logMove(from,to,ignore,pasarTurno,force,coronado){
	var original;
	
	var letra='', column='', fila='', separador='', sjaque='', sjm='', el='', ec='', oto, vj, alpaso=false, color, c2;
	if(!(from instanceof Array)){
		from=this.parseDestino(from)
		to=this.parseDestino(to)
	}
  if (!this.analizerEnabled){
    analizer.init(this.roomid,this.chessid);
    this.analizerEnabled=true;
  }
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
		if (!coronado) {
			var notacion='';
			if (!pasarTurno && !this.notUsePanel)
				notacion=this.getNotation(from,to);
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
			// var ppp=this.getByCoord([from[0],[from[1])
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
      var valor = this.matriz[to[0]][to[1]];
      var cols = ['a','b','c','d','e','f','g','h'];
      if (valor<0) valor=-valor;
      if (valor == 1 && from[1]!=to[1] && original=='')
        alpaso=true;
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
        // if (pieza.col>4) {
        if (to[1]>4) {
          rc=7;
        }
        else rc=0;
          if (this[jugador].piezas.row[0].pieza.state!=0 && this[jugador].piezas.row[0].pieza.col==rc && this[jugador].piezas.row[0].pieza.row==pieza.row) 
            rr=0;
          else
            rr=1;
        var prc;
        // if (rc==0) prc=pieza.col+1;
        if (rc==0) prc=to[1]+1;
        else prc = to[1]-1;
        // else prc = pieza.col-1;
        var to2=[pieza.row,prc];
        var from2=[pieza.row,rc];
        this.move(from2,to2,false,true);
        this[jugador].piezas.row[rr].pieza.remoteMove(to2);
      }
      else 
        letra = notacion?notacion:letra;
      var	vj = {chessid: this.chessid, 'from': from, 'to': to, 'capturada': capturada, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno, alpaso:alpaso};

      c2 = (color == 'blancas')?'negras':'blancas';
      if ((to[0]==0 || to[0]==7) && valor==1) {
        this.coronacion(from,to,ignore,pasarTurno,force,true,color,c2,vj,original);
        return true;
      } 
		}
		if (coronado)
			coronado.ignore=true;
		if (coronado && coronado.capturada && coronado.capturada.value) 
			coronado.capturada = {value:coronado.capturada.value}
		if (this.isJaque(c2,[-1,-1])) {
		}
    if (original) {
			 capturada=this.capturarPieza(original,oto);
		}
		else if (alpaso) {
			oto = [from[0],to[1]];
			vj.originalCapturedState={
				row:oto[0],
				col:oto[1],
				state:1
			}
			vj.alpaso=true
			capturada = this.capturarPieza(this.matriz[oto[0]][oto[1]],oto)
			this.matriz[oto[0]][oto[1]]='';
		}
		vj.capturada=capturada;
		vj.jugador=color;
    if (!pasarTurno) {
			if(0){}
			else {
				if(this.jugadaInfo.length<this.jugada)
						this.jugadaInfo.push([vj])
					else
						this.jugadaInfo[this.jugadaInfo.length-1].unshift(vj)
			}
		}
    else {
      this.jugadaInfo.push([vj])
      // this.jugadaInfo[this.jugadaInfo.length-1].push(vj);
    }
    if (!pasarTurno && this.updateJugada && !this.notUsePanel) {
      this.checkUpdateJugada(vj);
    }
    if (!pasarTurno)
      this.setTurno(c2);
    this.yellowRemark();
		
		if (this.inJaque){
			this[this.inJaque].piezas.king[0].pieza.element.style.backgroundColor='transparent';
			this.inJaque = '';
		}
		if (!pasarTurno) {
			this.jugada++
		}
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
		var pieza = this.getByCoord(from);
		if (pieza) {
			pieza.remoteMove(from);
		}
		this.matriz[to[0]][to[1]]=this.matriz[from[0]][from[1]];
		this.matriz[from[0]][from[1]]='';

		if (coronado) {
			pieza.setState({state:0});
			pieza = this[coronado.jugador].addPieza(coronado.pieza,coronado.to);
			this.matriz[to[0]][to[1]]=pieza.value;
		}

		var color = (this.matriz[to[0]][to[1]]<0) ? 'blancas' : 'negras';

		this.setTurno(color);

		if (pieza.name == 'peon' && from[1]!=to[1] && original=='') {
			alpaso=true;
		}

		if (original) {
			  capturada = this.capturarPieza(original,oto);
		}
		else if (alpaso) {
			oto = [from[0],to[1]];
			capturada = this.capturarPieza(this.matriz[oto[0]][oto[1]],oto)
			this.matriz[oto[0]][oto[1]]='';
		}

			var oco = pieza.color=='blancas'?'blanco':'negro';
			var or=this.orientacion?oco.orientacion:pieza.orientacion;
      if (or==1) {
				this.yellowRemark(this.idcasilla+(7-to[0])+'_'+to[1]);
			}
			else {
				this.yellowRemark(this.idcasilla+to[0]+'_'+(7-to[1]));
			}
					
		//this.yellowRemark(this.idcasilla+to[0]+'_'+to[1]);
//		var vj = {chessid: this.chessid, 'from': from, 'to': to, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
		var vj = {chessid: this.chessid, 'from': from, 'to': to, 'capturada': capturada, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
			if (!pasarTurno) {
				if(this.jugadaInfo.length<this.jugada)
					this.jugadaInfo.push([vj])
				else
					this.jugadaInfo[this.jugadaInfo.length-1].unshift(vj)
				// this.jugadaInfo.push([vj])
        this.jugada++;
        analizer.analize(jugador);
			}
			else {
				this.jugadaInfo.push([vj]);
			}
	}
}

IBaseChess.prototype.getInfo = function getInfo(ctxt,pnames){
	var info = {};
	var x;
	if (!pnames) pnames=[];
	switch(ctxt) {
		case 'ANALIS_1': 
			pnames.push('internalID');
		break;
		default: x=this; break;
	}
	
	if (pnames && pnames.length && pnames instanceof Array) {
		for (var i=0; i<pnames.length; ++i) {
			info[pnames[i]]=x[pnames[i]];
		}
	}
		
	return info;
}

IBaseChess.prototype.moveByNotation = function moveByNotation(n){
	if (chess.chesses[this.chessid].redoBuffer.length) {
		chess.chesses[this.chessid].unredo();
	}
	var i0 = this.jugada-1,
			j0 = (this.color=='blancas')?0:1,
			pieza;
	if(this.showExtra) this.showExtra(i0,j0);
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
				chess.chesses[this.chessid].move(moves[k][0],moves[k][1],false,false);
				if (pieza) pieza.remoteMove(moves[k][1]);
			}
	
}

IBaseChess.prototype.deactivate = function deactivate(){
	this.active=false;
	var ee=this.realContainer || this.element;
	// domHelper.mapToElement(ee,{'z-index':5,state:0});
	this.active=false;
		domHelper.mapToElement(ee,{'z-index':5,state:3});
//		this.realContainer.style.zIndex=5;
		ee.parentNode.style.zIndex=5;
		var h=this.handler || rooms.rooms[this.roomid];
		
		if (h && h.onDeactivation) {
			h.onDeactivation(this);
		}
		
	// domHelper.mapToElement(this.element,{'z-index':5,state:0});
}

IBaseChess.prototype.activate = function activate(){
	domHelper.mapToElement(this.realContainer || this.element,{'z-index':20,state:1});
	controller.activate(this);
	chess.setActiveChess(this.chessid);
}

IBaseChess.prototype.setActive = function setActive(){
	this.active=true;
	//this.element.style.zIndex=20;
	domHelper.mapToElement(this.realContainer || this.element,{'z-index':20,state:1});
	
	window[IBaseChess.prototype.proto].prototype.setActive.call(this);
	//if (this.handler && 
	var rr=rooms.rooms[this.roomid];
	if(rr && rr.onActivation) {
		rr.onActivation(this)
	}
	
	this.endActivation();
	
		// if (this.handler && this.handler.onActivation) {
			// this.handler.onActivation(this);
		// }

		//this.element.parentNode.appendChild(this.element.parentNode.removeChild(this.element));
	
}

IBaseChess.prototype.anular1 = function anular1(){
}

IBaseChess.prototype.getCasillatNotation = function getCasillatNotation(coord) {

	return String.fromCharCode(97+coord[1])+(+1+coord[0]);
}

IBaseChess.prototype.haceJaque = function haceJaque(pieza,to) {
	var jugador=pieza.color=='blancas'?'blanco':'negro';
	var piezas = ['row','horse','bishop','king'];
	var v=[], vp;
	var excluirTocado=[[pieza.row,pieza.col,''],[to[0],to[1],pieza.value]];
	for (var i=0; i<piezas.length; ++i) {
		vp = this[jugador].piezas[piezas[i]];
		for (var j=0; j<vp.length; ++j) {
			if (vp[j].pieza.id==pieza.id) {
				v = v.concat(this.getTocados({color:pieza.color,name:pieza.name,row:to[0],col:to[1],state:1,moved:pieza.moved,orienteacion:pieza.orientacion}));
			}
			else {
				v = v.concat(this.getTocados(vp[j].pieza));
			}
		}
	}
	if (jugador=='blanco') 
		jugador='negro';
	else
		jugador='blanco'
	
	var r=this[jugador].piezas.king[0].pieza.row;
	var c=this[jugador].piezas.king[0].pieza.col;
	var excluirTocado=[];
	for (var i=0; i<v.length; ++i) {
		if (v[i][0]==r && v[i][1]==c)
			return true;
	}
	return false;
}

IBaseChess.prototype.getNotation = function getNotation(from,to,antes) {
	var c = from[1], r=from[0], fil, col;
	var pieza = this.matriz[from[0]][from[1]];
	var piezad = this.matriz[to[0]][to[1]];
	var color;
	if (pieza<0) {
		color='negro';
		pieza=-pieza;
	}
	else {	
		color='blanco';
	}
	var col = String.fromCharCode(97+c);
	var row = r+1;
	var destino = this.getCasillatNotation(to);
	var np='';
	var desambig='', separador='';
	switch(pieza) {
		case 1: if(piezad) origen=col; 
					else {
						if (from[1]==to[1])
							origen=''; 
						else {
							origen=col;
							separador='x';
						}
					}
				np='pawn'; 
			
		break;
		case 2: origen='C'; np='horse';break;
		case 3: origen='A';  np='bishop';break;
		case 4:  origen='T'; np='row';break;
		case 5:  origen='D'; np='queen';break;
		case 6:  origen='R'; np='king';break;
	}
	var vp=this[color].piezas[np];
	var vm, vmi;
		for (var i=0; i<vp.length; ++i) {
			vm=[];
			if (vp[i].pieza.state==1 && (vp[i].pieza.row!=to[0] || vp[i].pieza.col!=to[1])) {
				vm = this.getMovimientos(vp[i].pieza);
				for (var j=0; j<vm.length; ++j) {
					if (vm[j][0]==to[0] && vm[j][1]==to[1]) {
						desambig = vp[i].pieza.col!=from[1] ? col : row;
						break;
					}
				}
			}
			else vmi=i;
		}
	if (np=='pawn') desambig='';
	var ljaque='';
	if (vmi!== undefined && this.haceJaque(this[color].piezas[np][vmi].pieza,to)) {
		ljaque='+';
	}
	
	if (piezad) {
		separador='x';
	}
	
	return origen+desambig+separador+destino+ljaque;
	
}

IBaseChess.prototype.moveJugada = function moveJugada(n){
	chess.logMatrix(this.chessid)
	if (this.timer) this.timer=clearTimeout(this.timer);
	if (this.callNumber==0) {
		this.callNumber=1;
		
	this.timer = setTimeout("chess.forceMove('"+n+"','"+this.chessid+"')",500);
		return;
	}
	else {
		this.callNumber=0;
	}
	var animate = false;
	if (n==1) {
		if (!this.lastJugada) {
			this.color = 'blancas';
			this.panelJugadas.markJugada();
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
				this.panelJugadas.markJugada();
				this.lastColor='blancas';
				this.lastJugada=this.jugada;
				animate='animate';
			}
			else {
				this.color='negras';
				this.lastColor='blancas';
				this.panelJugadas.markJugada();
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
		var info, v=[];
		if (this.borrar) {
			this.jugadas.pop();
		}
			if (this.color=='negras') {
				this.color='blancas';
				this.lastColor='negras';
//				this.panelJugadas.markJugada();
				//this.panelJugadas.setJugadas(v);
				this.lastColor='blancas';
				this.lastJugada=this.jugada;
				animate='redo';
			}
			else {
				this.color='negras';
				this.lastColor='blancas';
				//this.jugada--;
//				this.panelJugadas.markJugada();
				this.lastColor='negras';
				this.lastJugada=this.jugada;
				animate='redo';
			}
			chess.chesses[this.chessid].redo();
			//this.cleanExtras();
			return;
		
	}
	var ji=this.animating[this.jugada-1];
	// this.moveByNotation();
	this.move(ji[0],ji[1],true,true);
	// chess.animateOneEnabled=true; 
	// chess[animate]();
	// chess.animateOneEnabled=false; 
}

IBaseChess.prototype.juegaSoli = function juegaSoli(value){
	if (value) {
    
	}

}

IBaseChess.prototype.getElement = function getElement(e,o){
	switch(e) {
		case 'RECT_CEL':
			return this.tablero.getElement(e,[7-o[0],o[1]]);
		break;
		case 'CEL':
			return this.tablero.getElement(e,[7-o[0],o[1]]);
		break;
	}
}

IBaseChess.prototype.onCasillaRightClick = function onCasillaRightClick(e,o,c){
	var row;
	var col;
	var ee;
	var div = document.createElement('div');
	div.className='sobrecel';
	if (c instanceof Pieza) {
		row=c.row;
		col=c.col;
		ee=c.element;
		//div.style.position=0px;
		div.style.left='0px';
		div.style.top='0px';
    analizer.clear();
    analizer.analize();
    analizer.show(c);
    return;
  }
	else {
    return;
		row=o.parentNode.getAttribute('row');	
		col=o.getAttribute('col');	
		ee=c.element;
		if (this.orientacion==1) {
			row=7-row;
		}
		div.style.left=o.offsetLeft+'px';
		div.style.top=o.offsetTop+'px';
	}
	
	var s='',ss='';
	
	var info = analizer.getInfo('TOCADO',{'row':row,'col':col});
	
  counts={blancas:0,negras:0}
	for (var j in info) {
		for (var i=0; i<info[j].length; ++i) {
			ss+='i: '+i+'<br />';
				for (var k in info[j][i]) {
					ss+='   '+k+': '+info[j][i][k]+'<br />';
				}
			++counts[j];
		}
	}
	
	s='<span style="color:white">'+counts.blancas+'</span>';
	s+='<span style="color:red">'+counts.negras+'</span>';
	var d =counts.blancas-counts.negras
	if (d>0) 
		s+='<span style="color:white">'+d+'</span>';
	else if (d<0)
		s+='<span style="color:red">'+(-d)+'</span>';
	else {
		s+='<span style="color:gray">0</span>';
	}
	s+='  ['+row+','+col+']+<br />';
	div.innerHTML=s+ss;
	
	ee.appendChild(div);
	
//	analizer.analize.showCellInfo(c.
	return stopEvent(e);
}

IBaseChess.prototype.onCasillaClick = function onCasillaClick(e,o){
  var img = rooms.rooms[this.roomid].editPanel.getElementsByClassName('selected')[0].children[0];
  this.selected = +img.getAttribute('value')
  if (+this.selected<0) {
    jugador='negro';
    or = -1;
    }
  else {
    or = 1;
    jugador='blanco';
  }
  var pieza = this[jugador].getAvailable(this.selected);
  if (!pieza) return;
  or = this[jugador].orientacion==pieza.originalState.orientacion?this[jugador].orientacion:pieza.orientacion;
	var r = +o.parentNode.getAttribute('row')
  var c = +o.getAttribute('col')
  // if (or==1)
    pieza.setOriginalState({row:r, col:c, orientacion: or, state:1, moved:0, movedIn:-10})
  // else
    // pieza.setOriginalState({row:r, col:7-c, orientacion: or, state:1, moved:0, movedIn:-10})
}

IBaseChess.prototype.restart = function restart(){
  this.editing=false;
  rooms.rooms[this.roomid].editPanel.setAttribute('state',0);
}

IBaseChess.prototype.onEditPanel = function onEditPanel(e,o){
  var img = rooms.rooms[this.roomid].editPanel.getElementsByClassName('selected')[0].children[0];
  img.src = o.src;
  img.setAttribute('value',o.getAttribute('value'));
  this.selected = +img.getAttribute('value')
}

IBaseChess.prototype.onCoronacion = function onCoronacion(e,o){
	this.divCoronacion.style.display='none';
	document.body.setAttribute('blurEffect',0);
	var jugador = this.infoCoronacion.color=='blancas' ? 'blanco' : 'negro';
	var pieza = this[jugador].addPieza(o.getAttribute('value'),this.infoCoronacion.to);
	this.matriz[pieza.row][pieza.col]=pieza.value;
	this.infoCoronacion.pieza = pieza.value;
	this.infoCoronacion.jugador = jugador;
	this.infoCoronacion.vj.pieza = pieza.value;
	this.move(this.infoCoronacion.from,this.infoCoronacion.to,false,this.infoCoronacion.pasarTurno,this.infoCoronacion.force,this.infoCoronacion);
	switch (Math.abs(pieza.value)) {
		case 2: ip='N'; break;
		case 3: ip='B'; break;
		case 4: ip='R'; break;
		case 5: ip='Q'; break;
	}
	this.jugadas[this.jugadas.length-1]+='='+ip;
	this.panelJugadas.setJugadas(this.jugadas);
}

IBaseChess.prototype.coronacion = function coronacion(from,to,ignore,pasarTurno,force,oncorona,color,c2,vj,original){
	this.divCoronacion.style.display='block';
	document.body.setAttribute('blurEffect',1);
	this.infoCoronacion.from=from;
	this.infoCoronacion.to=to;
	this.infoCoronacion.ignore=ignore;
	this.infoCoronacion.pasarTurno=pasarTurno;
	this.infoCoronacion.force=force;
	this.infoCoronacion.color=color;
	this.infoCoronacion.c2=c2;
	this.infoCoronacion.vj=vj;
	this.infoCoronacion.original=original;
	this.divCoronacion.setAttribute('color',color);
	
	
}

IBaseChess.prototype.clean = function clean(){
  this.resetMatriz();
  if (!this.blanco || !this.blanco.piezas) {
    this.NEGRAS=this.BLANCAS=manageSessions.get('login');
    this.acomodar();
  }
  
  this.blanco.clean();
  this.negro.clean();
  
}

IBaseChess.prototype.reset = function reset(){
  this.blanco.reset();
  this.negro.reset();
  this.turno = 'blancas';
  this.resetMatriz();
  for (var i in this.blanco.piezas) {
    for (var j=0; j<this.blanco.piezas[i].length; ++j) {
      if (this.blanco.piezas[i][j].pieza.state==1)
        this.matriz[this.blanco.piezas[i][j].pieza.row][this.blanco.piezas[i][j].pieza.col]=this.blanco.piezas[i][j].pieza.value
    }
  }
  for (var i in this.negro.piezas) {
    for (var j=0; j<this.negro.piezas[i].length; ++j) {
      if (this.negro.piezas[i][j].pieza.state==1)
        this.matriz[this.negro.piezas[i][j].pieza.row][this.negro.piezas[i][j].pieza.col]=this.negro.piezas[i][j].pieza.value
    }
  }
  this.jugada=1;
  this.ultimoMovimiento=[];
  this.redoBuffer=[];
  this.infoCoronacion={};
  this.jugadaInfo=[];
  this.infoCima=0;
  
}

IBaseChess.prototype.resetMatriz = function resetMatriz(){
	var v;
  if (this.matriz.length==0) {
    for (var i=0; i<8; ++i) {
      v=[];
      for (var j=0; j<8; ++j) {
        v.push('');
      }
      this.matriz.push(v);
    }
  }
  else
    for (var i=0; i<8; ++i) {
      for (var j=0; j<8; ++j) {
        this.matriz[i][j]='';
      }
    }
}

IBaseChess.prototype.getPiezas = function getPiezas(){
	return {blanco: this.blanco.piezas, negro: this.negro.piezas};
}

IBaseChess.prototype.getLastAction = function getLastAction(lastUpdate){
	return this.lastAction.slice(lastUpdate);
}

IBaseChess.prototype.onCaptured = function onCaptured(e,o){
		var c = o;
		chess.closeCapturer();
		var x = e.clientX, y = e.clientY, rect;
		var fila = -1, columna=-1;
		for (var i=0; i<8; ++i) {
			rect = (this.tablero.cells[i*8].getClientRects())[0];
			if (y>=rect.top && y<rect.bottom) {
				fila = i;
				break;
			}
		}
		if (fila!=-1)  {
			for (var i=0; i<8; ++i) {
				rect = (this.tablero.cells[fila*8+i].getClientRects())[0];
				if (x>=rect.left && x<rect.right) {
					columna = i;
					break;
				}
			}
		}
		var c;
		if (columna!=-1) {
			c = document.getElementById(this.idcasilla+fila+'_'+columna);
		}
		
		chess.captured.mouseUp(e,o,c);
		
	}

IBaseChess.prototype.setTurno = function setTurno(color){
    this.turno=color;
		// $('#'+color)[0].style.backgroundColor='#ddd';
    // if (color=='blancas') 
      // $('#negras')[0].style.backgroundColor='transparent';
    // else
      // $('#blancas')[0].style.backgroundColor='transparent';
    if (this.tipoJuego=='1x1' || this[color.toUpperCase()]==this.user)
			this.element.setAttribute('active',color);

		if (this[color]==this.user) {
      $('.container.chess')[0].setAttribute('active',color);
    }
    else
      $('.container.chess')[0].setAttribute('active',0);
		rooms.rooms[this.roomid].setTurno(this.chessid,this[color.toUpperCase()]);
  }

IBaseChess.prototype.isJaque = function isJaque(color,to){  
	var v=[], rey, jq=false;
	if (color == 'negras') {
		color='blanco';
		rey =this.negro.piezas.king[0].pieza;
	}
	else {
		rey =this.blanco.piezas.king[0].pieza;
		color='negro';
	}
	for (var i in this[color].piezas) {
		for (var j=0; j<this[color].piezas[i].length; ++j) {
			if (to[0]==this[color].piezas[i][j].pieza.row && to[1]==this[color].piezas[i][j].pieza.col)
        continue;
      if (this[color].piezas[i][j].pieza.state!=0)
				v = v.concat(this.getMovimientos(this[color].piezas[i][j].pieza));
		}
	}
	jq=false;
	for (var i=0; i<v.length; ++i) {
		if (rey.row==v[i][0] && rey.col==v[i][1]) {
			jq=true;
			break;
		}
	}
	return jq;
}

IBaseChess.prototype.capturarPieza = function capturarPieza(valor,posicion){
	if (this.jugada<2)
		return;
	var jugador = (valor<0) ? 'negro' : 'blanco';
	if (valor<0) valor =- valor;
	
	switch(valor) {
		case 1: pieza='pawn';break;
		case 2: pieza='horse';break;
		case 3: pieza='bishop';break;
		case 4: pieza='row';break;
		case 5: pieza='queen';break;
		case 6: pieza='king';break;
	}
	for (var i=0; i<this[jugador].piezas[pieza].length; ++i) {
		if (this[jugador].piezas[pieza][i].pieza.row == posicion[0]
				&& this[jugador].piezas[pieza][i].pieza.state==1 
        && this[jugador].piezas[pieza][i].pieza.col == posicion[1]) {
					this[jugador].piezas[pieza][i].pieza.capturar()
					return this[jugador].piezas[pieza][i].pieza;
				}
	}
}

IBaseChess.prototype.jaque = function jaque(){
	var color = this.turno=='blancas'? 'blanco':'negro';
	this[color].piezas.king[0].pieza.element.style.backgroundColor='red';
	var c2 = this.turno == 'blancas' ? 'negro':'blanco';

	var v=[];
	for (var i in this[c2].piezas) {
		for (var j=0; j<this[c2].piezas[i].length; ++j) {
      if (this[c2].piezas[i][j].pieza.state!=0)
				v = v.concat(this.getTocados(this[c2].piezas[i][j].pieza));
		}
	}
	this.excluirPorJaque = v;
  this.inJaque = color;
	this.lastAction.push({action:'jaque'});
}

IBaseChess.prototype.capturer = function capturer(pieza){
	chess.captured=pieza;
	chess.idcasilla=this.idcasilla;
	chess.setActiveChess(this.chessid);
	chess.dcapturer.setAttribute('active','1');
	chess.dcapturer.setAttribute('activeChess',this.chessid);
  
  	var args={

  		onmouseup:function() {
			return chess.onCaptured(arguments[0],this);
		}
  	}

  	domHelper.mapToElement(chess.dcapturer,args);
	//chess.dcapturer.onmouseup=function() {
	//	return chess.onCaptured(arguments[0],this);
	//}
}//	

IBaseChess.prototype.invertir = function invertir(){
	this.orientacion*=-1;
	this.tablero.invertir();
	this.negro.invertir();
	this.blanco.invertir();
}

IBaseChess.prototype.getMovimientosPeon = function getMovimientosPeon(pieza,all){
		var result = [];
		if (pieza.row==7 || pieza.row==0) return [];
		var orientacion = pieza.orientacion * pieza.handler.orientacion;
		if (this.matriz[pieza.row+1*orientacion][pieza.col]=='') 
			result.push([pieza.row+1*orientacion,pieza.col]);
		if (result.length && (pieza.row==1 && orientacion==1 || pieza.row==6 && orientacion==-1)) {
			if (this.matriz[pieza.row+2*orientacion][pieza.col]=='') {
				result.push([pieza.row+2*orientacion,pieza.col]);
			}
		}
		var o, r, c, p;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		if (pieza.col>0) {
			o = this.matriz[pieza.row+1*orientacion][pieza.col-1];
			if (o && (o*sc<0 || all)) 
				result.push([pieza.row+1*orientacion,pieza.col-1])
			o = this.matriz[pieza.row][pieza.col-1];
			if (o && (o*sc<0 || all) && o==-pieza.value) {
				p = this.getByCoord([pieza.row,pieza.col-1]);
				if (p.moved==1 && this.jugada - p.movedIn <=2 )
						result.push([pieza.row+1*orientacion,pieza.col-1,true,pieza.row,pieza.col-1])
			}
		}
		if (pieza.col<7) {
			o = this.matriz[pieza.row+1*orientacion][pieza.col+1];
			if (o && (o*sc<0||all)) 
				result.push([pieza.row+1*orientacion,pieza.col+1])
			o = this.matriz[pieza.row][pieza.col+1];
			if (o && (o*sc<0||all) && o==-pieza.value) {
				p = this.getByCoord([pieza.row,pieza.col+1]);
				if (p.moved==1 && this.jugada - p.movedIn <=2 )
					result.push([pieza.row+1*orientacion,pieza.col+1,true,pieza.row,pieza.col+1])
			}
		}
		return result;
	}

IBaseChess.prototype.getVal = function getVal(row,col,noexc){
	var exc=[];
	if (!noexc) {
		exc=this.excluirTocado;
	}
	if (exc && exc.length) {
		for (var i=0; i<exc.length; ++i) {
			if (row==exc[i][0] && col==exc[i][1])
				return exc[i][2];
		}
	}
	return this.matriz[row][col];
}

IBaseChess.prototype.getTocadosPeon = function getTocadosPeon(pieza,all){
		var result = [];
		var o;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		if (pieza.col>0) {
			o = this.getVal(pieza.row+1*pieza.orientacion,pieza.col-1);
			if (o==='' || o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col-1])
		}
		if (pieza.col<7) {
			o = this.getVal(pieza.row+1*pieza.orientacion,pieza.col+1);
			if (o==='' || o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col+1])
		}			
		return result;
	}

IBaseChess.prototype.getMovimientosCaballo = function getMovimientosCaballo(pieza,all){
		var delta = [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]];
		var fil=pieza.row, col=pieza.col;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		for (var i=0; i<delta.length; ++i) {
			f=fil+delta[i][0];
			c=col+delta[i][1];
			if (f<0 || f>7 || c<0 || c>7) 
				continue;
			o = this.getVal(f,c);
			if (!o || (o*sc<0||all)) {
				result.push([f,c]);
			}
		}
		return result;
	
	}

IBaseChess.prototype.getMovimientosAlfil = function getMovimientosAlfil(pieza,all){
		var fil,col, f,c, o, seguir;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		var delta=[[1,1],[1,-1],[-1,1],[-1,-1]]
		for (var i=0; i<delta.length; ++i) {
			seguir=true;
			fil=pieza.row;
			col=pieza.col;
			
			while(seguir) {
				f=fil+delta[i][0];
				c=col+delta[i][1];
				if (f<0 || f>7 || c<0 || c>7) {
					seguir=false;
					break;
				}
				
				o = this.getVal(f,c);
				if (!o || (o*sc<0||all)) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0 && !all)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

IBaseChess.prototype.getMovimientosTorre = function getMovimientosTorre(pieza,all){
		var fil,col, f,c, o, seguir;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		var delta=[[1,0],[-1,0],[0,1],[0,-1]]
		for (var i=0; i<delta.length; ++i) {
			seguir=true;
			fil=pieza.row;
			col=pieza.col;
			
			while(seguir) {
				f=fil+delta[i][0];
				c=col+delta[i][1];
				if (f<0 || f>7 || c<0 || c>7) {
					seguir=false;
					break;
				}
				
				o = this.getVal(f,c);
				if (!o || (o*sc<0||all)) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0 && !all)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

IBaseChess.prototype.getMovimientosReina = function getMovimientosReina(pieza,all){
		var fil,col, f,c, o, seguir;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		var delta=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
		for (var i=0; i<delta.length; ++i) {
			seguir=true;
			fil=pieza.row;
			col=pieza.col;
			
			while(seguir) {
				f=fil+delta[i][0];
				c=col+delta[i][1];
				if (f<0 || f>7 || c<0 || c>7) {
					seguir=false;
					break;
				}
				
				o = this.getVal(f,c);
				if (!o || (o*sc<0||all)) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0 && !all)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

IBaseChess.prototype.getMovimientosRey = function getMovimientosRey(pieza,all){
	var delta = [[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0]];
		var fil=pieza.row, col=pieza.col;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		for (var i=0; i<delta.length; ++i) {
			f=fil+delta[i][0];
			c=col+delta[i][1];
			if (f<0 || f>7 || c<0 || c>7) 
				continue;
			o = this.getVal(f,c);
			if (!o || o*sc<0) {
				result.push([f,c]);
			}
		}
		if (pieza.moved==0) {
			var jugador;
			if (pieza.color=='blancas') {
				jugador = 'blanco';
			}
			else {
				jugador = 'negro';
			}
			var c0;
			if (!this.inJaque || this.inJaque!=jugador) {
			if (this[jugador].piezas.row[0].pieza.moved==0) {
				c0 = this[jugador].piezas.row[0].pieza.col;
				var ok=true;
				if (c0<pieza.col) {
					for (var i=1; i<pieza.col; ++i) {
						if (this.getVal(pieza.row,i)!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col-2]);
				}
				else {
					for (var i=6; i>pieza.col; --i) {
						if (this.getVal(pieza.row,i)!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col+2]);
				}
				if (ok) result.push([pieza.row, pieza.col-2]);
			}
			if (this[jugador].piezas.row[1].pieza.moved==0) {
				c0 = this[jugador].piezas.row[1].pieza.col;
				var ok=true;
				if (c0<pieza.col) {
					for (var i=1; i<pieza.col; ++i) {
						if (this.getVal(pieza.row,i)!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col-2]);
				}
				else {
					for (var i=6; i>pieza.col; --i) {
						if (this.getVal(pieza.row,i)!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col+2]);
				}
				
			}
			}
		}
		var r=[];
		if (this.excluirPorJaque && this.excluirPorJaque.length) {
			for (var i=0; i<result.length; ++i) {
				excluir=false;
				for (var j=0; j<this.excluirPorJaque.length; ++j) {
					if (result[i][0]==this.excluirPorJaque[j][0] && result[i][1]==this.excluirPorJaque[j][1]) {
						excluir=true;
						break;
					}
				}
				if (!excluir) r.push(result[i]);
			}
		}
		else return result;
		return r;
	}

IBaseChess.prototype.getTocados = function getTocados(pieza){
		switch(pieza.name) {
			case 'peon': return this.getTocadosPeon(pieza);	 break;
			case 'caballo': return this.getMovimientosCaballo(pieza); break;
			case 'alfil': return this.getMovimientosAlfil(pieza); break;
			case 'torre': return this.getMovimientosTorre(pieza); break;
			case 'reina': return this.getMovimientosReina(pieza); break;
			case 'rey': return this.getMovimientosRey(pieza); break;
		}
	}

IBaseChess.prototype.getMovimientos = function getMovimientos(pieza,all){
		
		switch(pieza.name) {
			case 'peon': return this.getMovimientosPeon(pieza,all);	 break;
			case 'caballo': return this.getMovimientosCaballo(pieza,all); break;
			case 'alfil': return this.getMovimientosAlfil(pieza,all); break;
			case 'torre': return this.getMovimientosTorre(pieza,all); break;
			case 'reina': return this.getMovimientosReina(pieza,all); break;
			case 'rey': return this.getMovimientosRey(pieza,all); break;
		}
	}

IBaseChess.prototype.getByCoord = function getByCoord(from){
	if (!from) return null;
  var valor = this.matriz[from[0]][from[1]],
    jugador, pieza, v, np;
  if(valor>0) {
    jugador='blanco';
  }
  else if (valor=='') {
		return null;
	}
  else {
    jugador='negro';
  }
  if (valor<0) valor=-valor
  switch(valor) {
    case 1: pieza='pawn'; break;
    case 2: pieza='horse'; break;
    case 3: pieza='bishop'; break;
    case 4: pieza='row'; break;
    case 5: pieza='queen'; break;
    case 6: pieza='king'; break;
  }
  var v=this[jugador].piezas[pieza];
  var np=-1;
  for (var i=0; i<v.length; ++i) {
    if (v[i].pieza.state==1 && v[i].pieza.row==from[0] && v[i].pieza.col==from[1]) {
      np=i;
      break;
    }
  }
  if (np>-1)
    return v[np].pieza;
  return null;
}

IBaseChess.prototype.getPawnFromByTo = function getPawnFromByTo(to,p,signo){
	if (p==='')
		p=to[1];
	else
		p=this.getColFromChar(p);
	var row = to[0],
			m = this.matriz[row][p];
	while (m != signo) {
		row-=signo;
		if (row<0 || row>7) return null;
		m = this.matriz[row][p];
	}
	return [row,p];
}

IBaseChess.prototype.getHorseFromByTo = function getHorseFromByTo(to,p,signo){
	var froms = [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]]
	var row, col;
	for (var i=0; i<8; ++i) {
		row = to[0]+froms[i][0];
		col = to[1]+froms[i][1];
		if (row<0 || row >7 || col<0 || col>7) 
			continue;
		if (this.matriz[row][col]==2*signo) {
			if (p=='')
				return [row,col];
			if (isNaN(p)) {
				if (p.charCodeAt(0)-97==col)
					return [row,col];
			}
			else {
				if (+p-1==row) {
					return [row,col];
				}
			}
		}
	}
	return null;
}

IBaseChess.prototype.getBishopFromByTo = function getBishopFromByTo(to,p,signo,queen){
	var deltas = [[-1,-1],[-1,1],[1,1],[1,-1]];
	var ii, jj, seguir, valor=queen?5:3;
	
	for (var i=0; i<4; ++i) {
		ii = to[0]-deltas[i][0];
		jj = to[1]-deltas[i][1];
		seguir=true;
		while (seguir) {
			if (ii>7 || ii<0 || jj>7 || jj<0)
				break;
			switch(this.matriz[ii][jj]) {
				case '': break;
				case valor*signo: 
					if (p=='')
						return [ii,jj];
					if (isNaN(p)) {
						if (p.charCodeAt(0)-97==jj)
							return [ii,jj];
					}
					else {
						if (+p-1==ii) {
							return [ii,jj];
						}
					}
				break;
				default:
					seguir=false;
				break;
			}
			ii-=deltas[i][0];
			jj-=deltas[i][1];
		}
	}
	return null;
}

IBaseChess.prototype.getRowFromByTo = function getRowFromByTo(to,p,signo,queen){
	var deltas = [[1,0],[-1,0],[0,-1],[0,1]];
	var ii, jj, seguir, valor=queen?5:4;
	for (var i=0; i<4; ++i) {
		ii = to[0]-deltas[i][0];
		jj = to[1]-deltas[i][1];
		seguir=true;
		while (seguir) {
			if (ii>7 || ii<0 || jj>7 || jj<0)
				break;
			switch(this.matriz[ii][jj]) {
				case '': break;
				case valor*signo: 
					if (p=='')
						return [ii,jj];
					if (isNaN(p)) {
						if (p.charCodeAt(0)-97==jj)
							return [ii,jj];
					}
					else {
						if (+p-1==ii) {
							return [ii,jj];
						}
					}
				break;
				default:
					seguir=false;
				break;
			}
			ii-=deltas[i][0];
			jj-=deltas[i][1];
		}
	}
	return null;
}

IBaseChess.prototype.getQueenFromByTo = function getQueenFromByTo(to,p,signo){
	var result = this.getBishopFromByTo(to,p,signo,true);
	return result ? result : this.getRowFromByTo(to,p,signo,true);
}

IBaseChess.prototype.getKingFromByTo = function getKingFromByTo(to,p,signo){
	var deltas =[[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
	for (var i=0; i<8; ++i) {
		row = to[0]-deltas[i][0];
		col = to[1]-deltas[i][1];
		if (row<0 || row>7 || col<0 || col>7)
			continue;
		if (this.matriz[row][col]==6*signo) {
			return [row,col];
		}
	}
	return null;
}

IBaseChess.prototype.getFromByTo = function getFromByTo(to,p,signo){
	switch(p) {
		case '':
		case 'a':
		case 'b':
		case 'c':
		case 'd':
		case 'e':
		case 'f':
		case 'g':
		case 'h':
			return this.getPawnFromByTo(to,p,signo);
		break;
	}
	var discriminante=''
	if (p.length==2) {
		discriminante=p.charAt(1);
	}
	switch(p.charAt(0)) {
		case 'C': return this.getHorseFromByTo(to,discriminante,signo); break;
		case 'A': return this.getBishopFromByTo(to,discriminante,signo); break;
		case 'T': return this.getRowFromByTo(to,discriminante,signo); break;
		case 'D': return this.getQueenFromByTo(to,discriminante,signo); break;
		case 'R': return this.getKingFromByTo(to,discriminante,signo); break;
	}
}

IBaseChess.prototype.getColFromChar = function getColFromChar(s){
	return s.charCodeAt(0)-97;
}

IBaseChess.prototype.parseDestino = function parseDestino(s){
	return  [+(s.charAt(1))-1,this.getColFromChar(s.charAt(0))];

}


IBaseChess.prototype.getMovedNumber = function getMovedNumber(){
	return this.jugada-1;
}

IBaseChess.prototype.yellowRemark = function yellowRemark(){
	if (!this.ultimoMovimiento) this.ultimoMovimiento=[];
	if (!arguments[0]) {
		while(this.ultimoMovimiento.length) {
			var du=this.ultimoMovimiento.pop();
			document.getElementById(du).style.borderColor='black';
			document.getElementById(du).style.borderWidth='2px';
		}
	}
	else {
		this.ultimoMovimiento.push(arguments[0]);
		document.getElementById(arguments[0]).style.borderColor='blue';
		document.getElementById(arguments[0]).style.borderWidth='3px';
	}
}

IBaseChess.prototype.acomodar = function acomodar(){
	var rb=1, rb1=0, rn=6, rn1=7;
	// if (this.blanco && this.blanco.color)
		// return;
	this.jugadaInfo=[];
	this.jugada=1;
  // var piezas = {
    // negras:{
      // pawn:[{row:3,col:5,state:1},
          // {row:2,col:6,state:1}],
      // king:
					// [{row:1,col:6,state:1}],
// row:					[{row:rn1,col:0,state:0},
						// {row:rn1,col:7,state:0} ]    
      // },
     // blancas:{
      // horse:[{row:1,col:5,state:1}],
      // queen:[{row:1,col:1,state:1}],
      // row:[{row:7,col:6,state:1},
            // {row:rn1,col:7,state:0}],
						
      
      // king:[{row:6,col:2,state:1}]
     // }
          
   // }
	 
  
	var piezas = {
		blancas:{
			pawn:[{row:rb,col:0,state:1},
						{row:rb,col:1,state:1},
						{row:rb,col:2,state:1},
						{row:rb,col:3,state:1},
						{row:rb,col:4,state:1},
						{row:rb,col:5,state:1},
						{row:rb,col:6,state:1},
						{row:rb,col:7,state:1}
						],
			horse:[
						{row:rb1,col:2,state:1},
						 {row:rb1,col:5,state:1}
						// {row:rb1,col:1,state:1},
						 // {row:rb1,col:6,state:1}
						],
			bishop:[
						{row:rb1,col:1,state:1},
						{row:rb1,col:6,state:1}
						// {row:rb1,col:2,state:1},
						// {row:rb1,col:5,state:1}
			],
			row:[
						{row:rb1,col:0,state:1},
						{row:rb1,col:7,state:1}
			],
			queen:[
						{row:rb1,col:3,state:1}
			],
			king:[
						{row:rb1,col:4,state:1}
			]
		},
		negras:{
			pawn:[{row:rn,col:0,state:1},
						{row:rn,col:1,state:1},
						{row:rn,col:2,state:1},
						{row:rn,col:3,state:1},
						{row:rn,col:4,state:1},
						{row:rn,col:5,state:1},
						{row:rn,col:6,state:1},
						{row:rn,col:7,state:1}
						],
			horse:[
						{row:rn1,col:2,state:1},
						{row:rn1,col:5,state:1}
						],
			bishop:[
						{row:rn1,col:6,state:1},
						{row:rn1,col:1,state:1},
			],
			row:[
						{row:rn1,col:0,state:1},
						{row:rn1,col:7,state:1}
			],
			queen:[
						{row:rn1,col:3,state:1}
			],
			king:[
						{row:rn1,col:4,state:1}
			]
		}
	}
	var k;
	
	
	this.matriz = [];
	var vr;
	for (var i=0; i<8; ++i) {
		vr = [];
		for (var j=0; j<8; ++j) {
			vr.push('');
		}
		this.matriz.push(vr)
	}
	for (var i in piezas) {
		m=(i=='blancas')?1:-1;
		for (var j in piezas[i]) {
			switch(j) {
				case 'pawn': n=1; break;
				case 'horse': n=2; break;
				case 'bishop': n=3; break;
				case 'row': n=4; break;
				case 'queen': n=5; break;
				case 'king': n=6; break;
			}
			for (var k=0; k<piezas[i][j].length; ++k) {
				this.matriz[piezas[i][j][k].row][piezas[i][j][k].col] = n*m;
			}
		}
		
	}
	
  
  return piezas;
}

IBaseChess.prototype.load = function load(jugadas,i0,j0){
  var jugada = '', captura, to, v, aux, jaque, mate, coronacion, moves=[];
	var remote=0, pieza;
	if (this.timer) {
		this.timer = clearTimeout(this.timer);
	}
	if (this.redoBuffer.length) {
		this.unredo();
		this.timer = setTimeout('chess.animate("'+this.chessid+'","'+i0+'","'+j0+'")',100)
		return;
	}
	//if (this.BLANCAS==manageSessions.get('login'))
		remote=0;
	if (typeof(i0) == 'undefined') {
		i0=0;
		this.animating = jugadas;
	}
	else i0=+i0;
	if (!j0) j0=0;
	else j0=+j0;
  for (var i=i0; i<this.animating.length; ++i) {
			for (var j=j0; j<2; ++j) {
      jugada = this.animating[i][j];
			if (!jugada)
				continue;
			captura=false;
			jaque=false;
			mate=false;
			coronacion=false;
      
      switch(jugada) {
        case 'O-O':
						moves.push([[7*j,4],[7*j,6]]);
						moves.push([[7*j,7],[7*j,5]])
        break;
        case 'O-O-O':
						moves.push([[7*j,4],[7*j,2]]);
						moves.push([[7*j,0],[7*j,3]])
        break;
        default:
					signo = j==0? 1: -1;
					if (jugada.length==2) {		// movimiento peon
						to = this.parseDestino(jugada);
						from = this.getFromByTo(to,'',signo);
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
							to = this.parseDestino(jugada.substr(-2));
							
							aux = aux.substring(0,aux.length-2);
							
							from = this.getFromByTo(to,aux,signo,captura);
							moves.push([from,to]);
						}
					}
				break;
			}
				
			for (k=0; k<1; ++k) {
				pieza=this.getByCoord(moves[k][0]);
				if (pieza) pieza.remoteMove(moves[k][1]);
				this.move(moves[k][0],moves[k][1],false,false);
			}
			if (j==1) {
				j0=0; i0=++i;
			}
			else ++j0;
			moves=[];
			this.timer = setTimeout('chess.animate("'+this.chessid+'","'+i0+'","'+j0+'")',100)
			return;
		}
	}
}

IBaseChess.prototype.updateJugada = function updateJugada(o){  
	// var d = rooms.rooms[this.roomid].element.getElementsByClassName('jugadas')[0];
	// var dd = document.createElement('DIV');
	// if (this.borrar) {
		// this.jugadaInfo.splice(
	// }
	var info = this.jugadaInfo[this.jugadaInfo.length-1][0];
	if (!info.jugada && o.jugada)
		info.jugada = o.jugada;
	if (o.color) info.color=o.color;
	this.jugadas.push(o.jugada);
	this.panelJugadas.updateJugada(o.color,info);	
  
	// if (o.color=='blancas') {
		// dd.innerHTML = Math.ceil(info.numero/2);
		// d.children[0].appendChild(dd);
		// dd = document.createElement('DIV');
    // dd.innerHTML = o.jugada;
		// d.children[1].appendChild(dd);
	// }
	// else {
    // dd.innerHTML = o.jugada;
		// d.children[2].appendChild(dd);
	// }
	//this.panelJugadas.markJugada();	
}

IBaseChess.prototype.onChangeJugada = function onChangeJugada(e,o) {
	alert(o.innerHTML);
}

IBaseChess.prototype.initPanelJugadas =function initPanelJugadas() {  
	var html='';
	// var d=document.createElement('div');
	//html += '<div class="jugadas" id="jugadas_'+this.roomid+'">';
  html +=   '<div class="jugada">N</div>';
  html +=   '<div class="jugada">blanco</div>';
  html +=   '<div class="jugada">negro</div>';
//  html += '</div>';
	// d.innerHTML=html;
	// this.element.appendChild(d.children[0]);

	var args = {
		eargs:{parentNode:this.element,className:'jugadas'},
		oargs:{owner:this,flierControl:true,jugada:this.jugada,jugadas:[]},
		common:{id:'Panel_jugadas_'+guid}
	}
	this.panelJugadas = new PanelJugadas(args);
}

IBaseChess.prototype.initMotion =function initMotion() {
	var this_=this;
	var args = {
		parentNode:this.element,
		className:'button-motion left',
		innerHTML:'<',
		onclick:function() {
			return this.onChangeJugada(arguments[0],this);
		}
	}
	sgCreateNode('DIV',args);
	args.innerHTML='>';
	args.className='button-motion right';
	sgCreateNode('DIV',args);
}

IBaseChess.prototype.setEventListener = function setEventListener(e,h,l) {
	if (!this.eventsHandlers) this.eventsHandlers = {};
	if (!this.eventsHandlers[e]) this.eventsHandlers[e] = [];
	this.eventsHandlers[e].push([h,l]);
	
}

IBaseChess.prototype.usePanel = function usePanel(use) {
	this.notUsePanel=!use;
	this.panelJugadas.element.style.display='none';
}

IBaseChess.prototype.keyDown = function keyDown(e,o) {
	if (e.keyCode==65) {
		macro(41,'LRFT');
	}

	if (this.eventsHandlers && this.eventsHandlers.keydown) {
		if (this.eventsHandlers.keydown.length) {
			for (var i=0; i<this.eventsHandlers.keydown.length; ++i) {
				var h=this.eventsHandlers.keydown[i];
				if (h[0][h[1]](e,o))
					return true;
			}
		}
	}
	switch(e.keyCode) {
		case 65:
      if (e.ctrlKey) {
        analizer.zIndex(6);
      }
      else
        analizer.showAllAtacados(e.shiftKey?'negro':'blanco');
		break;
		case 40:
			macro(41,'LEFT')
		break;
		case 37:
		case 39:
			return false;
			alert()
			this.moveJugada(e.keyCode-38);
			return true;
		break;
		
	}
	return false;
}


IBaseChess.prototype.init = function init(){
		window[IBaseChess.prototype.proto].prototype.init.call(this,arguments[0],{
			eargs:{display:'block', className:arguments[0].eargs.className || 'container chess'},
			oargs:{jugada:1, innited:true, tablero:{}, orientacion:1}
		})
		this.jugadas=[];
		this.tipoJuego='1x1';

		this.infoCoronacion={};
		this.infoCima=0;
		this.redoBuffer=[];
		this.jugadaInfo=[];
		this.ultimoMovimiento=[];
		this.lastAction = [];
		this.num = this.num || '';
		this.idcasilla=this.roomid+'_'+this.num+'_'+'casilla_';
		this.tablero = new Tablero({
			eargs : {
				parentNode: arguments[0].parentNode? arguments[0].parentNode : this.element,
				nplayers: 2
			},
			oargs : {
			
				handler: this,
				idcasilla: this.idcasilla
			},
			common : {
				id : 'tablero_'+this.roomid+'_'+this.chessid
			}
		})
		this.divCoronacion = document.createElement('DIV');
		this.divCoronacion.className='coronacion';
		var html = '';
		html += '<div class="blur">';
		html += '</div>';
		html += '<div class="blancas">';
		html += 	'<img value="2" src="images/caballob.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="3" src="images/alfilb.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="4" src="images/torreb.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="5" src="images/reinab.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += '</div>';
		html += '<div class="negras">';
		html += 	'<img value="-2" src="images/caballon.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="-3" src="images/alfiln.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="-4" src="images/torren.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="-5" src="images/reinan.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += '</div>';
		this.divCoronacion.innerHTML = html;
		document.body.appendChild(this.divCoronacion);
		
		var this_=this;
		
		var args = {eargs:{}, oargs:{}, common:{}};
		args.eargs.parentNode = this.element;
		args.oargs.handler = this;
		args.oargs.chessid=this.chessid;
		args.oargs.roomid=this.roomid;
		args.common.id = this.roomid+'_'+this.chessid+'_flier';
		this.flierControl = new FlierControl(args);
		
    $.ajax("jugadores", {
   "type": "get",   // usualmente post o get
   "success": function(result) {
     //this_.init1(result);
   },
   "error": function(result) {
     console.error("Este callback maneja los errores", result);
   },
   "async": true,
  });
	this.turno = 'blancas',
    this.user=manageSessions.get("login");
		chess.init();
		this.initMotion();
		this.initPanelJugadas();
		this.active=false;
		
		chess.inputFocus = this;		
  }


function BaseChess(){
}

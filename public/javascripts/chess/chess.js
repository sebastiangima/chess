	var ac=null;
	var ab0,an0,tb0,tn0;
	ab0=an0=tb0=tn0=null;
	var chess = (function(){
  var instance = null;
  
  
  Chess.prototype.dcapturer;
  Chess.prototype.innited;
  Chess.prototype.captured;
  Chess.prototype.orientacion;
  Chess.prototype.animatingMode;
  Chess.prototype.chesses;
  Chess.prototype.matriz = [];
  Chess.prototype.blanco = {};
  Chess.prototype.negro = {};
  Chess.prototype.jugando = false;
  Chess.prototype.empezado = false;
  Chess.prototype.movimientos = false;

  Chess.prototype.animateParams = {
		i0:-1,
		j0:-1,
		c:null,
		m:'one',
		r:0
	};

	Chess.prototype.preCargar_= function preCargar_(dirs,idirs,name){
    
    var r,c, l, data, index, vdata={}, i;
			var breakOne=false;
		if (name=='peon')	i=1;
		else if (name=='peon2') i=6;
		else i=0;
		
    for (i; i<8; ++i) {
      for (var j=0; j<8; ++j) {
        for (var k=0; k<dirs.length; ++k) {
          r=i; c=j;
          l=0;
          index = i*8+j;
          if (!vdata[idirs[k]]) vdata[idirs[k]]=[];
          if (!vdata[idirs[k]][index]) vdata[idirs[k]][index]=[];
					breakOne=false;
          while(1) {
            r+=dirs[k][0];
            if (r<0 || r>7) break;
            c+=dirs[k][1];
            if (c<0 || c>7) break;
            l++;
            data={row:r,col:c,'index':index,orden:l};
            vdata[idirs[k]][index].push(data);
						
						switch(name) {
							case 'peon':
								if (idirs[k]==1) {
									if(l==2 && r==3)
										breakOne=true;
								}		
								else
									breakOne=true;
							break;
							case 'peon2':
								if (idirs[k]==-1) {
									if(l==2 && r==4)
										breakOne=true;
								}		
								else
									breakOne=true;
							break;
							case 'rey':
								breakOne=true;
							break;
						}
						if (breakOne)
							break;
          }
        }
      }
    }
    this.movimientos[name] = vdata;
  }

	Chess.prototype.getMovimientosFrom= function getMovimientosFrom(p){
    if (!this.movimientos || !this.movimientos.alfil || !this.movimientos.alfil[9].length)
      this.preCargar();
    var result={};
    var index=p.row*8+p.col;
		var name = p.name;
		if (p.name=='peon' && p.color && p.color=='negras')
			name=name+'2';
    for (var i in this.movimientos[name]) {			// itera dirs dentro de los mov. de la pieza
			if (!result[i]) result[i]=[];
			
			result[i] = makeClone(this.movimientos[name][i][index]);
    } 
    return makeClone(result);
  }
  
	Chess.prototype.preCargar= function preCargar(){
    this.movimientos = {
      alfil:[],
      caballo:[],
      torre:[],
      reina:[],
      peon2:[],
      peon:[],
      rey:[]
    }
    
    // var dirs = [[1,1],[-1,1],[-1,-1],[1,-1]]
    // var idirs = [11,9,-11,-9]
    this.preCargar_(BishopChess.prototype.dirs,BishopChess.prototype.idirs,'alfil');
    this.preCargar_(RowChess.prototype.dirs,RowChess.prototype.idirs,'torre');
    this.preCargar_(QueenChess.prototype.dirs,QueenChess.prototype.idirs,'reina');
    this.preCargar_(PawnChess.prototype.dirs,PawnChess.prototype.idirs,'peon');
    this.preCargar_(PawnChess.prototype.dirs2,PawnChess.prototype.idirs2,'peon2');
    this.preCargar_(HorseChess.prototype.dirs,HorseChess.prototype.idirs,'caballo');
    this.preCargar_(KingChess.prototype.dirs,KingChess.prototype.idirs,'rey');
			
    // var dirs = [[1,0],[0,1],[-1,0],[0,-1]]
    // var idirs = [1,10,-1,-10]
    // this.preCargar_(dirs,idirs,'torre');
		// var dirs = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]
    // var idirs = [1,11,10,9,-1,-11,-10,-9];
    // this.preCargar_(dirs,idirs,'reina');
		
		
	}

	Chess.prototype.endDeactivation= function endDeactivation(chessid){
			this.chesses[this.activeChess].setActive();
		ac=chess.chesses[chess.activeChess];
		if (ac.blanco && ac.blanco.piezas && ac.blanco.piezas.bishop) {
			ab0=ac.blanco.piezas.bishop[0].pieza;
			an0=ac.negro.piezas.bishop[0].pieza;
			tb0=ac.blanco.piezas.row[0].pieza;
			tn0=ac.negro.piezas.row[0].pieza;
		}
	}
	
	Chess.prototype.setActiveChess= function setActiveChess(chessid){
		if (this.activeChess && this.activeChess!= chessid) {
			var c=	this.activeChess;
			this.activeChess=chessid;
			this.chesses[c].deactivate();
		}
	
		else {
			if(this.activeChess == chessid) {
			}
			else {
				this.activeChess=chessid;
				this.endDeactivation()
			
			}

		}
	}
	
	Chess.prototype.onEditPanel= function onEditPanel(e,o,chessid){
		return this.chesses[chessid].onEditPanel(e,o);
  }
  
	Chess.prototype.onCoronacion= function onCoronacion(e,o,chessid){
		return this.chesses[chessid].onCoronacion(e,o);
	}
	
	Chess.prototype.startAnimation= function startAnimation(roomid,chessid,mode,jugadas){
		if (!mode) mode = 'one';
		this.setAnimateParams(roomid,chessid,0,0,mode);
		this.chesses[chessid].acomodar();
		this.chesses[chessid].load(jugadas);
		
	}
	
	Chess.prototype.setAnimateParams= function setAnimateParams(roomid,chessid,i,j,mode){
		this.animateParams = {
			i0:i,
			j0:j,
			c:chessid,
			m:mode,
			r:roomid
		}
	}	

  Chess.prototype.unredo = function unredo(){ 
		if(this.activeChess && this.chesses[this.activeChess])
			this.chesses[this.activeChess].unredo();
	}
  Chess.prototype.redo = function redo(){ 
		if(this.activeChess && this.chesses[this.activeChess])
			this.chesses[this.activeChess].redo();
		//this.chesses[this.animateParams.c].redo();
	}
	
  Chess.prototype.animate = function animate(c,i,j){ 
		if(typeof(i)=='undefined') {
			i=this.animateParams.i0;
			j=this.animateParams.j0;
			c=this.animateParams.c;
		}
		switch(this.animateParams.m) {
			case 'one': 
				if (this.animateOneEnabled) {
					this.chesses[c].load(null,i,j);
				}
				else {
					this.animateParams.i0=i;
					this.animateParams.j0=j;
					this.animateParams.c=c;
				}
			break;
			case 'stop': break;
			case 'play': 
				this.chesses[c].load(null,i,j);
			break;
		}
	}
	
  Chess.prototype.add = function add(c){ 
		this.chesses[c.chessid]=c;
		if (!(c instanceof Tablerito))
			this.setActiveChess(c.chessid);
		return c;
	}
	
  Chess.prototype.isJaque = function isJaque(color){  
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
	
  Chess.prototype.trasponer = function trasponer(){  
		var m=[];
		for (var i=0; i<8; ++i) {
			
			for (var j=0; j<8-i; ++j) {
				aux = this.matriz[i][j];
				this.matriz[i][j]=this.matriz[7-i][7-j];
				this.matriz[7-i][7-j]=aux;
			}
		}
	}
	
	Chess.prototype.changeOrientacion = function changeOrientacion(){  
    this.blanco.changeOrientacion();
    this.negro.changeOrientacion();
		this.orientacion*=-1;
		
    var up=$('.arriba')[0];
    var dow=$('.abajo')[0];
    up.className='abajo';
    dow.className='arriba';
		this.trasponer();
  }
 
  Chess.prototype.capturarPieza = function capturarPieza(valor,posicion){
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
          && this[jugador].piezas[pieza][i].pieza.col == posicion[1]) {
            this[jugador].piezas[pieza][i].pieza.state=0;
            this[jugador].piezas[pieza][i].pieza.element.setAttribute('state',0);
          
          }
    }
  }

  Chess.prototype.acomodar = function acomodar(chessid,BLANCAS,NEGRAS){
		if (this.chesses[chessid].setPlayers)
			this.chesses[chessid].setPlayers(BLANCAS,NEGRAS);
		this.chesses[chessid].acomodar();
	}

  Chess.prototype.jaque = function jaque(){
		var color = this.turno=='blancas'? 'blanco':'negro';
		this[color].piezas.king[0].pieza.element.style.backgroundColor='red';
	}

  Chess.prototype.move = function move(from,to,ignore,pasarTurno){
		var original;
		var letra='', column='', fila='', separador='', sjaque='', sjm='', el='', ec='', oto;
    original = this.matriz[to[0]][to[1]];
    oto=[to[0],to[1]];
    if (!ignore) {
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
			var color = (this.matriz[to[0]][to[1]]<0) ? 'blancas' : 'negras';
			var c2 = '';
			if (color=='blancas') {
				c2= 'negras';
				
			}
			else
				c2 = 'blancas';
			if (this.isJaque(c2)) {
				this.matriz[from[0]][from[1]]=this.matriz[to[0]][to[1]];
				this.matriz[to[0]][to[1]]='';
				return false;
			}
			if (color=='blancas') {
				this.jugada++;
				var p = document.getElementsByClassName('jugadas')[0];
				var pp=document.createElement('DIV');
				pp.innerHTML=this.jugada+'.';
				p.children[0].appendChild(pp);
			}
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
					case 1: break;
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
			
			var jugador = c2=='blancas'?'blanco':'negro';
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

			var vj = {jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
			if (this.isJaque(color)) {
				socket.emit("movimiento", from, to, true, vj);
			}
			else
				socket.emit("movimiento", from, to, false, vj);
				if (!pasarTurno && this.updateJugada) 
					this.updateJugada(vj);
       if (original) {
         this.capturarPieza(original,oto);
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
			// if (this.orientacion==-1) 
				// valor = this.matriz[7-from[0]][7-from[1]];
			// else
			valor = this.matriz[from[0]][from[1]];
			if(valor>0) {
				jugador='blanco';
			}
			else {
				jugador='negro';
			}
			if (valor<0) valor=-valor
			var pieza;
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
				if (v[i].pieza.row==from[0] && v[i].pieza.col==from[1]) {
					np=i;
					break;
				}
			}
			if (np>-1) {
				v[np].pieza.remoteMove(to);
			}
			this.matriz[to[0]][to[1]]=this.matriz[from[0]][from[1]];
			this.matriz[from[0]][from[1]]='';
			var color = (this.matriz[to[0]][to[1]]<0) ? 'blancas' : 'negras';
			this.setTurno(color);

	if (original) {
         this.capturarPieza(original,oto);
       }		
		}
	}

	Chess.prototype.onCaptured = function onCaptured(e,o){
		var c = o;
		var chessid = this.dcapturer.getAttribute('activeChess');
		return this.chesses[chessid].onCaptured(e,o);
		this.closeCapturer();
		var x = e.clientX, y = e.clientY, rect;
		var fila = -1, columna=-1;
		for (var i=0; i<8; ++i) {
			rect = (this.cells[i*8].getClientRects())[0];
			if (y>=rect.top && y<rect.bottom) {
				fila = i;
				break;
			}
		}
		if (fila!=-1)  {
			for (var i=0; i<8; ++i) {
				rect = (this.cells[fila*8+i].getClientRects())[0];
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
		
		this.captured.mouseUp(e,o,c);
		
	}
	
	Chess.prototype.showCellsDomination = function showCellsDomination(){
		var v=[], w={}, key, vn=[], wn={}, colors, bc;
		for (var i in this.blanco.piezas) {
			for (var j=0; j<this.blanco.piezas[i].length; ++j) {
				v = this.getTocados(this.blanco.piezas[i][j].pieza)
				for (var k=0; k<v.length; ++k) {
					key = v[k][0]+'_'+v[k][1]
					if (!w[key]) w[key]=0;
					w[key]++;
				}
				key = this.blanco.piezas[i][j].pieza.row+'_'+this.blanco.piezas[i][j].pieza.col;
				if (!w[key]) w[key]=0;
				w[key]++;
			}
		}
		for (var i in this.negro.piezas) {
			for (var j=0; j<this.negro.piezas[i].length; ++j) {
				vn = this.getTocados(this.negro.piezas[i][j].pieza)
				for (var k=0; k<vn.length; ++k) {
					key = vn[k][0]+'_'+vn[k][1]
					if (!wn[key]) wn[key]=0;
					wn[key]++;
				}
				key = this.negro.piezas[i][j].pieza.row+'_'+this.negro.piezas[i][j].pieza.col;
				if (!wn[key]) wn[key]=0;
				wn[key]++;
			}
		}
		var colors = {b:['#00f','#00b','#008','#004','#002','#001'],
		n:['#0f0','#0b0','#080','#040','#020','#010']}
		for (var i=0; i<8; ++i) {
			for (var j=0; j<8; ++j) {
				bc='';
				key = i+'_'+j;
				if (w[key] && wn[key]) {
					if (w[key]>wn[key]) {
						bc = colors.b[w[key]-wn[key]]
					}
					else if (w[key]<wn[key]) {
						bc =  colors.n[wn[key]-w[key]]
					}
					else {
						bc='';
					}
				}
				else if (w[key]) {
					bc =  colors.b[w[key]];
				}
				else if (wn[key]) {
					bc =  colors.n[wn[key]];
				}
				if (bc) {
					document.getElementById(this.idcasilla+key).style.backgroundColor=bc;
				}
			}
		}
	}
	
	Chess.prototype.closeCapturer = function closeCapturer(pieza){
		this.dcapturer.setAttribute('active','0');
	}

	Chess.prototype.capturer = function capturer(pieza){
		this.captured=pieza;
		this.dcapturer.setAttribute('active','1');
		this.dcapturer.onmouseup=function() {
			return chess.chesses[this.activeChess].onCaptured(arguments[0],this);
		}
	}
	
	Chess.prototype.showRivalHorseAction_ = function showRivalHorseAction_(pieza,nc,v){
		var colors = ['yellow','orange','red','green','blue','violet','gray'];
		var m = this.getMovimientos(pieza);
		var d;
		var original = [pieza.row,pieza.col];
		for (var i=0; i<m.length; ++i) {
			d = document.getElementById(this.idcasilla+m[i][0]+'_'+m[i][1]);
			d.style.border = 'solid '+colors[nc];
		}
		if (nc<2) {
			++nc;
			for (var i=0; i<m.length; ++i) {
				if (!v[m[i][0]*8+m[i][1]]) {
					v[m[i][0]*8+m[i][1]]=1;
					pieza.row=m[i][0];
					pieza.col=m[i][1];
					this.showRivalHorseAction_(pieza,nc,v);
				}
			}
		}
	}
	
	Chess.prototype.showRivalHorseAction = function showRivalHorseAction(shift){
		var jugador = 'blanco';
		if (this.blancas==this.user) {
			jugador = 'negro';
		}
		if (shift) {
			pieza = this[jugador].piezas.horse[1].pieza;
		}
		else
			pieza = this[jugador].piezas.horse[0].pieza;
		this.showRivalHorseAction_(pieza,0,{});
		
		
		
	}

	Chess.prototype.forceMove = function forceMove(n,c){
		this.chesses[c].moveJugada(n);
	}
	
	Chess.prototype.keyDown = function keyDown(e,o){
			if (e.keyCode==65) {
				macro(41,'LRFT');
					alert(e.keyCode)
			}
			else
			if (e.keyCode==27) {
			}
			else {
				if (e.ctrlKey && e.keyCode=='32') {
          if (analizer.clear())
            return stopEvent(e);
        }
				if (this.inputFocus) {
					this.inputFocus = this.activeChess ? this.chesses[this.activeChess] : this.inputFocus;
					if (this.inputFocus.keyDown(e,o)) {
						return stopEvent(e);
					}
				}
			}
			switch(e.keyCode) {
			
			case 37: 
				this.animateOneEnabled=true; 
				this.redo();
				this.animateOneEnabled=false; 
			break;
			case 40: 
				macro(41,'LEFT');
			break;
			case 39: 
				this.animateOneEnabled=true; 
				this.unredo();
				// this.animate();
				this.animateOneEnabled=false; 
			break;
			case 32: 
				this.animateOneEnabled=!this.animateOneEnabled; 
				this.animate();
			break;
			case 65:if (e.ctrlKey) {this.showCellsDomination();}break;
			case 49:if (e.ctrlKey) {this.showRivalHorseAction(e.shiftKey);}break;
		}
	}

	Chess.prototype.getMovimientosPeon = function getMovimientosPeon(pieza){
		var result = [];
		
		if (this.matriz[pieza.row+1*pieza.orientacion][pieza.col]=='') 
			result.push([pieza.row+1*pieza.orientacion,pieza.col]);
		if (result.length && (pieza.row==1 && pieza.orientacion==1 || pieza.row==6 && pieza.orientacion==-1)) {
			if (this.matriz[pieza.row+2*pieza.orientacion][pieza.col]=='') 
				result.push([pieza.row+2*pieza.orientacion,pieza.col]);
		}
		var o;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		if (pieza.col>0) {
			o = this.matriz[pieza.row+1*pieza.orientacion][pieza.col-1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col-1])
		}
		if (pieza.col<7) {
			o = this.matriz[pieza.row+1*pieza.orientacion][pieza.col+1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col+1])
		}			
		return result;
	}

  Chess.prototype.getTocadosPeon = function getTocadosPeon(pieza){
		var result = [];
		var o;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		if (pieza.col>0) {
			o = this.matriz[pieza.row+1*pieza.orientacion][pieza.col-1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col-1])
		}
		if (pieza.col<7) {
			o = this.matriz[pieza.row+1*pieza.orientacion][pieza.col+1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col+1])
		}			
		return result;
	}

  Chess.prototype.getMovimientosCaballo = function getMovimientosCaballo(pieza){
		var delta = [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]];
		var fil=pieza.row, col=pieza.col;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		for (var i=0; i<delta.length; ++i) {
			f=fil+delta[i][0];
			c=col+delta[i][1];
			if (f<0 || f>7 || c<0 || c>7) 
				continue;
			o = this.matriz[f][c];
			if (!o || o*sc<0) {
				result.push([f,c]);
			}
		}
		return result;
	
	}

  Chess.prototype.getMovimientosAlfil = function getMovimientosAlfil(pieza){
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
				
				o = this.matriz[f][c];
				if (!o || o*sc<0) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

  Chess.prototype.getMovimientosTorre = function getMovimientosTorre(pieza){
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
				
				o = this.matriz[f][c];
				if (!o || o*sc<0) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

  Chess.prototype.getMovimientosReina = function getMovimientosReina(pieza){
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
				
				o = this.matriz[f][c];
				if (!o || o*sc<0) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

  Chess.prototype.getMovimientosRey = function getMovimientosRey(pieza){
	var delta = [[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0]];
		var fil=pieza.row, col=pieza.col;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		for (var i=0; i<delta.length; ++i) {
			f=fil+delta[i][0];
			c=col+delta[i][1];
			if (f<0 || f>7 || c<0 || c>7) 
				continue;
			o = this.matriz[f][c];
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
			if (this[jugador].piezas.row[0].pieza.moved==0) {
				c0 = this[jugador].piezas.row[0].pieza.col;
				var ok=true;
				if (c0<pieza.col) {
					for (var i=1; i<pieza.col; ++i) {
						if (this.matriz[pieza.row][i]!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col-2]);
				}
				else {
					for (var i=6; i>pieza.col; --i) {
						if (this.matriz[pieza.row][i]!='') {
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
						if (this.matriz[pieza.row][i]!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col-2]);
				}
				else {
					for (var i=6; i>pieza.col; --i) {
						if (this.matriz[pieza.row][i]!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col+2]);
				}
				
			}
			
		}
		return result;
	}

	Chess.prototype.getTocados = function getTocados(pieza){
		switch(pieza.name) {
			case 'peon': return this.getTocadosPeon(pieza);	 break;
			case 'caballo': return this.getMovimientosCaballo(pieza); break;
			case 'alfil': return this.getMovimientosAlfil(pieza); break;
			case 'torre': return this.getMovimientosTorre(pieza); break;
			case 'reina': return this.getMovimientosReina(pieza); break;
			case 'rey': return this.getMovimientosRey(pieza); break;
		}
	}

  Chess.prototype.getMovimientos = function getMovimientos(pieza){
		
		switch(pieza.name) {
			case 'peon': return this.getMovimientosPeon(pieza);	 break;
			case 'caballo': return this.getMovimientosCaballo(pieza); break;
			case 'alfil': return this.getMovimientosAlfil(pieza); break;
			case 'torre': return this.getMovimientosTorre(pieza); break;
			case 'reina': return this.getMovimientosReina(pieza); break;
			case 'rey': return this.getMovimientosRey(pieza); break;
		}
	}

  Chess.prototype.noMorePlayer = function noMorePlayer(user){
		if (this.blancas == user) {
			this.blancas='';
			delete this.blanco;
		}
		else if (this.negras == user) {
			this.negras='';
			delete this.negro;
		}
	}
	
  Chess.prototype.updatePlayer = function updatePlayer(user){
    this[user[1]]=user[0];
    if (this.blancas && this.negras) {
      if (this.blancas == this.user) {
        $('.comenzar')[0].removeAttribute('disabled');
      }
    }
  }

  Chess.prototype.init1 = function init1(result){
    var o ='';
    var cant=0, btn;
    this.user=manageSessions.get("login");
    eval('o='+result);
    for (var i in o) {
      $('#'+o[i])[0].innerHTML=i;
      btn='';
      if (i==this.user) {
        
      }
      else {
        if (o[i]=='blancas') {
          btn=$('.unirse')[0];
        }
        else {
          btn=$('.unirseN')[0]
        }
      }
      cant++;
      if (btn)
        btn.setAttribute('disabled',true);
    }
    
    
    console.log(result);
  }

  Chess.prototype.start = function start(chessid,blamcas,negras){
    chess.acomodar(this.chessid,this.BLANCAS,this.NEGRAS);
  }
  
  Chess.prototype.setTurno = function setTurno(color){
    $('#'+color)[0].style.backgroundColor='#ddd';
    if (color=='blancas') 
      $('#negras')[0].style.backgroundColor='transparent';
    else
      $('#blancas')[0].style.backgroundColor='transparent';
    if (this[color]==this.user) {
      $('.container.chess')[0].setAttribute('active',color);
    }
    else
      $('.container.chess')[0].setAttribute('active',0);
		this.turno = color;
			
  }

	Chess.prototype.logMatrix = function logMatrix(chessid){
	
		var c=chess.chesses[chessid || chess.activeChess];
		var dcr; var drr=[]; 
		for (var i=0; i<8; ++i) {
			dcr=[]; 
			for(var j=0; j<8; ++j) {
				var n=c.matriz[i][j].toString() || '.'; 
				dcr.push(n.padLeft(3,' '))
			}
			drr.push(dcr.join('\t'));
		} 
		console.log('\r\n'+drr.reverse().join('\r\n'))
		
		var jug=['blanco','negro'];
		var errorAcum=[];
		for (var j=0; j<jug.length; ++j) {
			var jugPiezas=c[jug[j]].piezas;
			for (var tp in jugPiezas) {
				for (var np=0; np<jugPiezas[tp].length; ++np) {
					var pieza=jugPiezas[tp][np].pieza;
					if (pieza.state && c.matriz[pieza.row][pieza.col]!=pieza.value) {
						errorAcum.push({msg: 'matriz y pieza no sincronizadas',matrixVal:c.matriz[pieza.row][pieza.col],piezaVal:pieza.value,row:pieza.row, col:pieza.col, pieza:pieza, 'chess': c})
					}
				}
			}
		
		}
		if (errorAcum.length) {
			console.log(errorAcum);
			alert('Se detecto estado inconsistente de los datos, se muestra por consola los datos implicados.\r\nEl error es grave, ya no hay coherencia en la lógica del juego. Quejese con el bugcreator, pero no le prestará atención')
		}
  }
	
	Chess.prototype.init = function init(){
		if (this.innited)
			return;
		var dcapturer = document.getElementsByClassName('capturer');
		if (dcapturer && dcapturer.length==1) this.dcapturer=dcapturer[0];
		else {
			this.dcapturer = document.createElement('div');
			this.dcapturer.className='capturer';
			document.body.appendChild(this.dcapturer);
		}
		document.body.onkeydown = function() {
			if(arguments[0].keyCode==65) 
				return macro(41,'LEFT')
			if(arguments[0].keyCode==73 && arguments[0].shiftKey && arguments[0].ctrlKey) {
				if(!chess.finalTitle) {
					self.document.title='CHESS LAN SG'
				}
			}
			else
				chess.keyDown(arguments[0],this);
		}

		this.innited = true;
		return;
  }
  
  function Chess(){
		this.chesses={};
		this.orientacion=1;
		this.jugada=0;
    this.preCargar();
	}
  
  return instance ? instance : instance = new Chess();

})()
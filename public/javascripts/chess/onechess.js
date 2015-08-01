function IOneChess(){}
IOneChess.prototype = new IBaseChess()
IOneChess.prototype.proto='IBaseChess';

IOneChess.prototype.jugando = false;
IOneChess.prototype.empezado = false;

IOneChess.prototype.move = function move(from,to,ignore,pasarTurno,force,coronado){
		var original;
		
		var letra='', column='', fila='', separador='', sjaque='', sjm='', el='', ec='', oto, vj, alpaso=false, color, c2;
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
				if (!pasarTurno)
					var notacion=this.getNotation(from,to);
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
								letra = cols[from[1]];
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
				else 
					letra=notacion;

				
				vj = {chessid: this.chessid, 'from': from, 'to': to, 'capturada': capturada, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
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
				
				
				this.lastAction.push({action:"movimiento",params:[from,to,true,vj]});
			this.excluirPorJaque=[];
			if (this.isJaque(c2,[-1,-1])) {
				socket.emit("movimiento", from, to, true, vj, coronado);
				
				
			}
			else {
				this.lastAction.push({action:"movimiento",params:[from,to,false,vj]});
	if (this.orientacion==-1){
						from[0]=7-from[0];
						from[1]=7-from[1];
						to[0]=7-to[0];
						to[1]=7-to[1];
				}
				socket.emit("movimiento", from, to, false, vj, coronado);
			}
				
				

       if (original) {
         capturada=this.capturarPieza(original,oto);
      }
			else if (alpaso) {
				oto = [from[0],to[1]];
				capturada = this.capturarPieza(this.matriz[oto[0]][oto[1]],oto)
        this.matriz[oto[0]][oto[1]]='';
			}
			
			vj.capturada=capturada;
			vj.jugador=color;
			vj.jugada=letra;	
			if (!pasarTurno) {
				this.jugadaInfo.push([vj])
			}
			else {
				//this.jugadaInfo[this.jugadaInfo.length-1].push(vj);
			}


			if (!pasarTurno && this.updateJugada) {
					
					this.updateJugada(vj);
			}
			if (this.inJaque) {
				this[jugador].piezas.king[0].pieza.element.style.backgroundColor='transparent';
			}
			this.inJaque='';
			if (!pasarTurno)
				this.setTurno(c2);
			this.yellowRemark();
      if (this.inJaque){
        this[this.inJaque].piezas.king[0].pieza.element.style.backgroundColor='transparent';
        this.inJaque = '';
        
      }
			if (!pasarTurno)
				this.jugada++;
			return true;
		}
		else {
//			var notacion=this.getNotation(from,to);
			var jugador, valor;
			// if (this.orientacion==-1) {
				// from[0]=7-from[0];
				// from[1]=7-from[1];
				// to[0]=7-to[0];
				// to[1]=7-to[1];
			// }
			// // valor = this.matriz[from[0]][from[1]];

      var pieza = this.getByCoord(from);
			if (pieza) {
				pieza.remoteMove(to);
				this.lastAction.push({action:"remoteMove",params:[pieza,to]});
			}
			this.matriz[to[0]][to[1]]=this.matriz[from[0]][from[1]];
			this.matriz[from[0]][from[1]]='';

			if (coronado) {
				pieza.setState({state:0});
				pieza = this[coronado.jugador].addPieza(coronado.pieza,coronado.to);
				this.matriz[to[0]][to[1]]=pieza.value;
			}
			
			color = (this.matriz[to[0]][to[1]]<0) ? 'blancas' : 'negras';
			
			if (!pasarTurno)
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
			var or=this.orientacion?this.orientacion:pieza.orientacion;
      if (or==1) {
				this.yellowRemark(this.idcasilla+(7-to[0])+'_'+to[1]);
			}
			else {
				this.yellowRemark(this.idcasilla+to[0]+'_'+(7-to[1]));
			}
			
			vj = {chessid: this.chessid, 'from': from, 'to': to, 'capturada': capturada, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};

			if (!pasarTurno) {
				this.jugadaInfo.push([vj])
			}
			else {
				//this.jugadaInfo[this.jugadaInfo.length-1].push(vj);
			}
			if (!pasarTurno)
				++this.jugada;
		}
	}

IOneChess.prototype.acomodar = function acomodar(state){    
  if (this.blanco && this.blanco.piezas) {
    return this.restart();
  }
  var piezas = window[IOneChess.prototype.proto].prototype.acomodar.call(this);
	this.blanco = new Player( {piezas:piezas['blancas'], handler: this, idcasilla: this.idcasilla, parentNode: this.tablero.element, chessid: this.chessid, name: this.BLANCAS, orientacion:1, color:'blancas'});
  this.negro = new Player( {piezas:piezas['negras'], handler: this, idcasilla: this.idcasilla, parentNode: this.tablero.element, chessid: this.chessid, name: this.NEGRAS, orientacion:-1, color:'negras'});
	return piezas;
}

IOneChess.prototype.changeOrientacion = function changeOrientacion(){  
	this.blanco.changeOrientacion();
	this.negro.changeOrientacion();
	this.orientacion*=-1;
	
	var up=$('.arriba')[0];
	var dow=$('.abajo')[0];
	up.className='abajo';
	dow.className='arriba';
	this.trasponer();
}

/*IOneChess.prototype.updateJugada = function updateJugada(o){  
	var info = this.jugadaInfo[this.jugadaInfo.length-1][0];
	if (!info.jugada && o.jugada)
		info.jugada = o.jugada;
	this.panelJugadas.updateJugada(o.color,info);	
	//this.panelJugadas.markJugada(o);	
return;	
	if (o.color=='blancas') {
		dd.innerHTML = Math.ceil(info.numero/2);
		d.children[0].appendChild(dd);
		dd = document.createElement('DIV');
    dd.innerHTML = o.jugada;
		d.children[1].appendChild(dd);
	}
	else {
    dd.innerHTML = o.jugada;
		d.children[2].appendChild(dd);
	}
}
*/
IOneChess.prototype.load = function load(jugadas,i0,j0){
  var jugada = '', captura, to, v, aux, jaque, mate, coronacion, moves=[];
	var remote=1, pieza;
	if (this.timer) {
		this.timer = clearTimeout(this.timer);
	}
	if (this.redoBuffer.length) {
		this.unredo();
		this.timer = setTimeout('chess.animate("'+this.chessid+'","'+i0+'","'+j0+'")',1000)
		return;
	}
	if (this.BLANCAS==manageSessions.get('login'))
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
			this.timer = setTimeout('chess.animate("'+this.chessid+'","'+i0+'","'+j0+'")',1000)
			return;
		}
	}
}

IOneChess.prototype.setPlayers = function setPlayers(b,n){
	this.BLANCAS = b;
	this.NEGRAS = n;
}

IOneChess.prototype.noMorePlayer = function noMorePlayer(user){
		if (this.blancas == user) {
			this.blancas='';
			delete this.blanco;
		}
		else if (this.negras == user) {
			this.negras='';
			delete this.negro;
		}
	}
	
IOneChess.prototype.updatePlayer = function updatePlayer(user){
    this[user[1]]=user[0];
    if (this.blancas && this.negras) {
      if (this.blancas == this.user) {
        $('.comenzar')[0].removeAttribute('disabled');
      }
    }
  }

IOneChess.prototype.init1 = function init1(result){
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
  }



IOneChess.prototype.init = function init(){
		window[IOneChess.prototype.proto].prototype.init.call(this,arguments[0],{
			eargs:{display:'block', className:'container chess'},
			oargs:{jugada:0, innited:true, orientacion:1}
		})
		this.tipoJuego='1x2';
		var this_=this;

    $.ajax(	"jugadores", {
				"type": "get", 
				"success": function(result) {
										 this_.init1(result);
									 },
				"error": function(result) {
									 console.error("Este callback maneja los errores", result);
									},
				"async": true});
	this.turno = 'blancas',
	this.user=manageSessions.get("login");
		// chess.init();
		// var boton = document.getElementsByClassName('unirse')[0];
		// boton.setAttribute('fuerza_display','1');
}
		

function OneChess(){
	this.init(arguments[0])
}
	
OneChess.prototype = new IOneChess();
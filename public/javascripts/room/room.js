function IRoom(){}
IRoom.prototype = new IBaseRoom()
IRoom.prototype.proto='IBaseRoom';

function habilitarTiempo(e,o) {
  e.preventDefault();
	var tags = o.parentNode.getElementsByTagName('input'); 
	for (var i=1; i<tags.length; ++i) {
		if (o.checked) 
			tags[i].removeAttribute('disabled'); 
		else 
			tags[i].setAttribute('disabled',true)
	}
	return stopEvent(e);
}

IRoom.prototype.hide = function hide(){
	this.element.style.display='none';
}

IRoom.prototype.editar = function editar(){
  this.clean();
  chess.chesses[this.chessid].editing=true;
 
  this.editPanel.setAttribute('state',1);
}

IRoom.prototype.clean = function clean(){
	socket.emit("clean", this.roomid);
	chess.chesses[this.chessid].clean();
	var d = this.element.querySelectorAll("input[name='jugadores']")[0]
	if (d.checked) {
	}

  
}

IRoom.prototype.reset = function reset(){
	socket.emit("reset", this.roomid);
  chess.chesses[this.chessid].reset();
}

IRoom.prototype.synchro = function synchro(){
	for (var i=0; i<this.tableritos.length; ++i) {
		this.tableritos[i].synchro();
	}
}

// Room.prototype.move = function start(from,to,bulean){
	// chess.chesses[this.chessid].move(from,to,bulean)
// }


// Room.prototype.jaque = function jaque(){
	// chess.chesses[this.chessid].jaque()
// }

IRoom.prototype.habilitarTiempo = function habilitarTiempo(e,o){
  e.preventDefault();
	var tags = o.parentNode.getElementsByTagName('input'); 
	for (var i=1; i<tags.length; ++i) {
		if (o.checked) 
			tags[i].removeAttribute('disabled'); 
		else 
			tags[i].setAttribute('disabled',true)
	}
	this[o.name]=o.checked?1:0;
	socket.emit("changeOptions", this.roomid,o.name,this[o.name]);
}

IRoom.prototype.htmlTime = function htmlTime(){
	if (this.tiempo==0)
		return 'SIN TIEMPO';
	return this.ti+ ' / '+this.ixj + '       MAX '+this.mxp;
}

IRoom.prototype.changeOption = function changeOption(o,v){
	this[o]=v;
	$('input[name="'+o+'"]')[0].value = v;
}

IRoom.prototype.optionsChange = function optionsChange(e,o){
	this[o.name]=o.value;
	socket.emit("changeOptions", this.roomid,o.name,o.value);
}

IRoom.prototype.invertir = function invertir(){
	chess.chesses[this.chessid].invertir();
}


IRoom.prototype.onSalir = function onSalir(e,o){
  var user = manageSessions.get('login');
  var color='';
  if (this.BLANCAS==user) {
    color='BLANCAS';
  }
  else if (this.NEGRAS==user) {
    color='NEGRAS';
  }
  if (color)
    socket.emit("unSetColor", user,this.roomid,color);

  this.element.style.display='none';
}

IRoom.prototype.onCommand = function onCommand(e,o){
	e.preventDefault();
	switch(o.innerHTML) {
    case 'VOLVER 1':
      this.anular1();
    break;
		default:
			window[IRoom.prototype.proto].prototype.onCommand.call(this,e,o);
		break;
	}
	return stopEvent(e);

}

IRoom.prototype.start = function start(){
	chess.acomodar(this.chessid,this.BLANCAS,this.NEGRAS);
}

IRoom.prototype.refresh = function refresh(msg,args){
	switch(msg) {
		case 'unSetColor':
      args.user=''; 
		case 'setColor':
      this[msg](args); 
    break;
	}
}

IRoom.prototype.unSetColor = function unSetColor(color){
	this.setColor({'color': color, user: ''});
}

IRoom.prototype.setColor = function setColor(args){
	var span = $('SPAN.'+args.color,this.element)[0];
	span.innerHTML = args.user;
	this[args.color]=args.user;
	var btn = this.getElement('COMENZAR');
	var btn2 = this.getElement('SALIR');
	if (this.BLANCAS && this.NEGRAS) {
		btn.removeAttribute('disabled')
		btn2.setAttribute('disabled',true);
	}
	else {
		btn.setAttribute('disabled',true);
		btn2.removeAttribute('disabled');
	}
}
IRoom.prototype.setChessId = function setChessId(chessid){
	this.chessid=chessid;
	for (var i=0; i<this.tableritos.length; ++i) {
		this.tableritos[i].setChessId(chessid);
	}
}

IRoom.prototype.show = function show(){
	this.element.style.display='block';
	
	if (!this.innited) {
		if (manageSessions.get('login')==this.owner) {
			this.chessid = 'chess_'+guid.toString();
			socket.emit("setChessId", this.roomid, this.chessid);
		}
		// else
			
		chess.add(new OneChess({
			eargs:{
				parentNode: document.getElementById('table-tablero-'+this.roomid)
			},
			oargs:{
				chessid: this.chessid,
				roomid: this.roomid
			},
			common:{
				id: this.rooomid+'_chess'
			}
		}))
		this.endInit();
	}
	else {
		
		
	}
	
	this.innited = true;
}

IRoom.prototype.init = function init(eargs,oargs){
	eargs = eargs || {};
	oargs = oargs || {};
	common = {}
	this.innited = false;
  var this_=this;
	eargs.className = 'room';
	oargs.tableritos=[]
	eargs.parentNode = document.getElementsByClassName('room-container')[0];
	
	

	this.tableritos=[];

	this.menuOptions = ['SALIR','COMENZAR','SAVE','VOLVER 1','EDITAR','RESET','INVERTIR','SINCRONIZAR','TABLERITO'];
	
	
	
	eargs.name='nn';
  
	eargs.onclick = function() {
    if (arguments[0].target != this_.element && arguments[0].target.onchange===null) {
      arguments[0].target.click();
      if (arguments[0].stopPropagation)
        arguments[0].stopPropagation();
       arguments[0].cancelBubble=true;
      return false;
    }
    else {
      $(".rooms-container")[0].style.zIndex=0;
      $(".room-container")[0].style.zIndex=1;
      return true;
    }
	}
	var args={
		'eargs':eargs,
		'oargs':oargs,
		'common':common
	}
	
	window[IRoom.prototype.proto].prototype.init.call(this,eargs,oargs)
	
	// // this.element = sgCreateNode('DIV', eargs);
	// // for (var i in oargs) {
		// // this[i]=oargs[i];
	// // }
  // // for (var i in eargs) {
		// // if (eargs[i] instanceof Function) {
		// // }
		// // else {
			// // this[i]=eargs[i];
		// // }
	// // }

	// var dd = document.createElement('div');
	// this.element.appendChild(dd);
	// dd.innerHTML='<div class="arriba">BLANCAS: <span id="blancas"></span></DIV><DIV class="abajo">NEGRAS: <span id="negras"></span></DIV><div class="jugadas"><div></div><div></div><div></div></div>';
	
	// var dt = document.createElement('DIV');
	// dt.className='tableritos';
	// this.element.appendChild(dt);
	
	
	
	// this.initPanel();
	// this.initGame();
	// this.initPartidas();
	// this.initEditPanel();
	// var d = document.createElement('DIV');
	// d.className='btn-comenzar';
	// d.innerHTML='COMENZAR';
	// this.element.appendChild(d);
	// var btns = this.element.getElementsByTagName('button');
	// for (var i=0; i<btns.length; ++i) {
		// btns[i].onclick = function() {
			// return this_.onCommand(arguments[0],this);
		// }
	// }

}

function Room(){
	this.init(arguments[0]);
}

Room.prototype = new IRoom();


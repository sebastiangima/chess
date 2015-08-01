function ILocalRoom(){}
ILocalRoom.prototype = new IBaseRoom()
ILocalRoom.prototype.proto='IBaseRoom';

ILocalRoom.prototype.editar = function editar(){
  this.clean();
	this.setEditMode(true);
    var d=this.element.querySelectorAll('div.container.chess')[0];
  var r = d.getClientRects();

  var bl=this.element.querySelectorAll('div.editpanel>div.blancas')[0];
  var ng=this.element.querySelectorAll('div.editpanel>div.negras')[0];
  
  if (this.chess.orientacion==-1) {
    bl.style.top=(r[0].top-75 )+'px';
    ng.style.top=(r[0].bottom+10)+'px';
  }
  else {
    ng.style.top=(r[0].top-75)+'px';
    bl.style.top=(r[0].bottom+10)+'px';
  }
  
}

ILocalRoom.prototype.setEditMode = function setEditMode(value){
  this.chess.setEditMode(value);
  this.editPanel.setAttribute('state',value?'1':'0');
}

ILocalRoom.prototype.clean = function clean(){
	this.chess.clean();
	var d = this.element.querySelectorAll("input[name='jugadores']")[0]
	if (d && d.checked) {
	}
}

ILocalRoom.prototype.start = function start(e,o){
	window[ILocalRoom.prototype.proto].prototype.start.call(this,e,o);
	e.preventDefault();
	
	this.setEditMode(false);
	this.chess.restart();
	return cancelEvent(e)

}

ILocalRoom.prototype.onCommand = function onCommand(e,o){
	switch(o.innerHTML){
		case 'COMENZAR':
			return this.start(e,o);
		break;
		case 'PICHI':
			return this.start(e,o,true);
		break;		
	}
	return window[ILocalRoom.prototype.proto].prototype.onCommand.call(this,e,o);
}

ILocalRoom.prototype.show = function show(){
	//chess.init({parentNode:this.element});	
	this.element.style.display='block';
	
}


ILocalRoom.prototype.reset = function reset(){
	socket.emit("reset", this.roomid);
  chess.chesses[this.chessid].reset();
}

ILocalRoom.prototype.init = function init(){
	this.roomid = 'room_'+guid;
	this.chessid = this.roomid+'_chess_'+guid;
	
	this.menuOptions = ['SALIR','COMENZAR','SAVE','VOLVER 1','APERTURAS','EDITAR','RESET','INVERTIR','SINCRONIZAR','PICHI','TABLERITO','PARTIDAS'];
	
	var d = document.createElement('DIV');
	this.user = manageSessions.get('login');
	
	this.chess = new LocalChess({
		eargs:{
			parentNode: d,
		},
		oargs:{
			chessid: this.chessid,
			roomid: this.roomid,
			BLANCAS:this.user,
			NEGRAS:this.user,
		},
		common:{
			id: this.roomid+'_chess_'+this.chessid+guid
		}
	})

	
	window[ILocalRoom.prototype.proto].prototype.init.call(this,arguments[0],{
		eargs:{display:'block', className:'container chess'},
		oargs:{jugada:0, innited:true, orientacion:1}
	})
	var td=document.getElementById('table-tablero-'+this.roomid)
	// this.element.appendChild(d.children[0]);
	td.appendChild(d.children[0]);
	chess.add(this.chess);
	this.turno = 'blancas',
	this.BLANCAS=this.NEGRAS=this.user=manageSessions.get("login");
	
	this.endInit();
}
		

function LocalRoom(){
	this.init(arguments[0])
}
	
LocalRoom.prototype = new ILocalRoom();

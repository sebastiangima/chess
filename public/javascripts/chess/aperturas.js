var aperturas = (function(){
	var instance = null;
	
	Aperturas.prototype.move = function move(n) {
		this.apertura.moveJugada(n);
	}
	Aperturas.prototype.keyDown = function keyDown(e,o) {
		alert(e.keyCode)
		switch(e.keyCode) {
			case 37:
			case 39:
				this.apertura.moveJugada(e.keyCode-38);
				return true;
			break;
		}
		return false;
	}
	
	Aperturas.prototype.select = function select(id,r,c) {
		var clase, tipo, args={};
		
		switch(id) {
			case 'DSVDN': 
				clase = 'DefensaSiciliana';
				tipo = 'VDN';
			break;
			default:return; break;
		}
		args.roomid=r;
		args.chessid=c;
		args.tipo=tipo;
		args.parentNode = rooms.rooms[r].getElement('APERTURA');
		this.apertura = new window[clase](args);
		chess.inputFocus = this;
	}
	
	function Aperturas(){
	}
	
	return instance ? instance : instance = new Aperturas();
})()
function IPlayer(){}
IPlayer.prototype = new ISgObject();

IPlayer.prototype.changeOrientacion = function changeOrientacion(){
  this.setOrientacion(this.orientacion*-1);
}

IPlayer.prototype.getPiezaByValueAndCoord = function getPiezaByValueAndcoord(c,v){
  switch(v) {
    case 1:case -1: return this.getPiezaByCoord(c,'pawn'); break;
    case 2:case -2: return this.getPiezaByCoord(c,'horse'); break;
    case 3:case -3: return this.getPiezaByCoord(c,'bishop'); break;
    case 4:case -4: return this.getPiezaByCoord(c,'row'); break;
    case 5:case -5: return this.getPiezaByCoord(c,'queen'); break;
    case 6:case -6: return this.getPiezaByCoord(c,'king'); break;
  }
}
IPlayer.prototype.getPiezaByValueAndGUID = function getPiezaByValueAndGUID(g,v){
  switch(v) {
    case 1:case -1: return this.getPiezaByGUID(g,'pawn'); break;
    case 2:case -2: return this.getPiezaByGUID(g,'horse'); break;
    case 3:case -3: return this.getPiezaByGUID(g,'bishop'); break;
    case 4:case -4: return this.getPiezaByGUID(g,'row'); break;
    case 5:case -5: return this.getPiezaByGUID(g,'queen'); break;
    case 6:case -6: return this.getPiezaByGUID(g,'king'); break;
  }
}

IPlayer.prototype.getPiezaByCoord = function getPiezaByCoord(c,t){
  if (!t) 
    t = ['pawn','horse','bishop','row','queen','king'];
  else
    t=[t]
    
  for (var i=0; i<t.length; ++i) {
    for (var j=0; j<this.piezas[t[i]].length; ++j) {
      if (this.piezas[t[i]][j].pieza.row==c[0] && this.piezas[t[i]][j].pieza.col==c[1] )
        return this.piezas[t[i]][j].pieza;
    }
  }

  return null;}

IPlayer.prototype.getPiezaByGUID = function getPiezaByGUID(g,t){
  if (!t) 
    t = ['pawn','horse','bishop','row','queen','king'];
  else
    t=[t]
    
  for (var i=0; i<t.length; ++i) {
    for (var j=0; j<this.piezas[t[i]].length; ++j) {
      if (this.piezas[t[i]][j].pieza.internalGUID==g)
        return this.piezas[t[i]][j].pieza;
    }
  }

  return null;
}
IPlayer.prototype.invertir = function invertir(dir){
	this.orientacion*=-1;
  for (var i in this.piezas) {
    for (var j=0; j<this.piezas[i].length; ++j) {
      this.piezas[i][j].pieza.invertir();
    }
  }
}

IPlayer.prototype.setOrientacion = function setOrientacion(dir){
  for (var i in this.piezas) {
    for (var j=0; j<this.piezas[i].length; ++j) {
      this.piezas[i][j].pieza.row = 7-this.piezas[i][j].pieza.row;
      this.piezas[i][j].pieza.col = 7-this.piezas[i][j].pieza.col;
      this.piezas[i][j].pieza.element.style.top = 50*this.piezas[i][j].pieza.row+'px';
      this.piezas[i][j].pieza.element.style.left = 50*this.piezas[i][j].pieza.col+'px';
      this.piezas[i][j].pieza.orientacion=dir;
    }
  }
  this.orientacion = dir;
}

IPlayer.prototype.getAvailable = function getAvailable(value){
  var pieza;
  switch(value) {
    case 1:
    case -1:
      pieza='pawn'; break;
    case 2:
    case -2:
      pieza='horse'; break;
    case 3:
    case -3:
      pieza='bishop'; break;
    case 4:
    case -4:
      pieza='row'; break;
    case 5:
    case -5:
      pieza='queen'; break;
    case -6:
    case 6:
      pieza='king'; break;
  }
  for (var i=0; i<this.piezas[pieza].length; ++i) {
    if (this.piezas[pieza][i].pieza.state==0) {
      return this.piezas[pieza][i].pieza;
    }
  }
  return null;
    
}

IPlayer.prototype.clean = function clean(){
  for (var i in this.piezas) {
    for (var j=0; j<this.piezas[i].length; ++j) {
      this.piezas[i][j].pieza.clean()
    }
  }
  this.orientacion = this.originalState.orientacion;
}

IPlayer.prototype.reset = function reset(){
  var pieza;
	for (var i in this.piezas) {
    for (var j=0; j<this.piezas[i].length; ++j) {
      pieza = this.piezas[i][j].pieza;
			pieza.setOriginalState()
    }
  }
  this.orientacion = this.originalState.orientacion;

}

IPlayer.prototype.getMovedNumber = function getMovedNumber(){
	return this.handler.getMovedNumber();
}

IPlayer.prototype.addPieza = function init(tipo,coord){
	var pieza, opieza;
	switch(tipo.toString()) {
		case '-2':
		case '2': 
			pieza='Horse'; 
		break;
		case '-3': 
		case '3': 
			pieza='Bishop'; 
		break;
		case '-4': 
		case '4': 
			pieza='Row'; 
			
		break;
		case '5': 
		case '-5': 
			pieza='Queen'; 
		break;
	}
	args = {
		row: coord[0],
		col: coord[1],
		chessid:this.chessid,
		color:this.color,
		id:this.idcasilla+'pieza_'+this.color+'_'+pieza.toLowerCase()+'_'+this.piezas[pieza.toLowerCase()].length,
		idcasilla:this.idcasilla,
		columna:coord[1],
		fila:coord[0],
		handler:this,
		orientacion:this.piezas.king[0].orientacion,
		parentNode:this.piezas.king[0].pieza.parentNode,
		pcolor:this.color,
		state:1,
		user:this.piezas.king[0].pieza.user,
		pieza:{}
	}
		
		

	var orientacion = (this.orientacion == args.orientacion)? this.orientacion:args.orientacion;
	if (orientacion==1) {
	}
	else{
		args.col=7-args.col;
		args.row=7-args.row;
	}
	
	var opieza;
	for (var i=0; i<this.piezas.pawn.length; ++i) {
		switch (this.piezas.pawn[i].pieza.row) {
			case 0:
			case 7:
				if (this.piezas.pawn[i].pieza.state==1) {
					this.piezas.pawn[i].pieza.setState({state:0});
				}
			break;
		}
	}

	var opieza = new window[pieza+'Chess'](args)
	args.pieza = opieza;
	this.piezas[pieza.toLowerCase()].push(args)
	return opieza;
}

IPlayer.prototype.init = function init(){
  var args=arguments[0];
	ISgObject.prototype.init.call(this,args);
  var k;
  for (var j in this.piezas) {
    k=j[0].toUpperCase()+j.substr(1)
    k+='Chess';
    for (var l=0; l<this.piezas[j].length; ++l) {
      this.piezas[j][l].id = this.idcasilla +'pieza' +'_'+ this.color+'_'+j+'_'+l;
      this.piezas[j][l].orientacion = 1;
      this.piezas[j][l].parentNode = arguments[0].parentNode;
      this.piezas[j][l].color = this.color;
      this.piezas[j][l].user = args.name;
      this.piezas[j][l].chessid = args.chessid;
			this.piezas[j][l].idcasilla= arguments[0].idcasilla;
      this.piezas[j][l].pieza = new window[k](this.piezas[j][l]);
      this.piezas[j][l].pieza.handler = this;
    }
  }
  this.originalState = {
    orientacion: this.orientacion
  }
    
}

function Player(){
  this.init(arguments[0]);
}

Player.prototype = new IPlayer();
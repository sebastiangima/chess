function ITablero(){}
ITablero.prototype = new ISgControl();
ITablero.prototype.proto = 'ISgControl';


ITablero.prototype.getElement = function getElement(e,o){
	switch(e) {
		case 'RECT_CEL':
			return this.getElement('CEL',o).getClientRects()[0];
		break;
		case 'CEL':
			return this.element.querySelector("div#"+this.idcasilla+o[0]+'_'+o[1]);
		break;
	}
}
ITablero.prototype.invertir = function invertir(){
	this.orientacion*=-1;
	if (this.orientacion==1) {
		this.rotacion=0;
	}
	else
		this.rotacion=180;
	this.rowsNumber.setAttribute('rotacion',this.rotacion);
	this.colsNames.setAttribute('rotacion',this.rotacion);
}

ITablero.prototype.init = function init(){
	window[this.proto].prototype.init.call(this,arguments[0],{
		eargs:{display:'block', className:'tablero grande'},
		oargs:{jugada:0, innited:true, orientacion:1}
	})

	var dr, cr=0, dc, cc, this_=this;
	
	for (var i=0; i<8; ++i) {
		dr =  document.createElement('div');
		dr.setAttribute('row',i);
		this.element.appendChild(dr);
		cc = cr
		dr.className = 'row';
		for (var j=0; j<8; ++j) {
				dc =  document.createElement('div');
				dc.setAttribute('col',j);
				dc.className = 'col';
				dr.appendChild(dc);
				dc.id = this.idcasilla+i+'_'+j;
				dc.setAttribute('color',cc);
				dc.oncontextmenu=function(){
					return this_.handler.onCasillaRightClick(arguments[0],this,this_);
					// return cancelEvent(arguments[0]);
				}
				
				cc = 1-cc;

        dc.onmousedown = function() {
					console.log(arguments[0],this_);
					if (this_.handler && this_.handler.activate) {
						 chess.setActiveChess(this_.handler.chessid)
					}
					if (arguments[0].button==2) {
						return this_.handler.onCasillaRightClick(arguments[0],this,this_);
					}
          if (this_.handler.editing)
            return this_.handler.onCasillaClick(arguments[0],this);
					
        }				
		}    
		cr = 1-cr;
	}
	this.cells = this.element.getElementsByClassName('col');	
	var dc = document.createElement('DIV');
	for (var i=1; i<9; ++i) {
		dr = document.createElement('DIV');
		dr.innerHTML=9-i;
		dr.className='row-number';
		dc.appendChild(dr);
	}
	this.element.parentNode.parentNode.appendChild(dc);
	dc.className='rows-numbers';
	this.rowsNumber=dc;
	var dc = document.createElement('DIV');
	for (var i=0; i<8; ++i) {
		dr = document.createElement('DIV');
		dr.innerHTML=String.fromCharCode(97+i);
		dr.className='col-name';
		dc.appendChild(dr);
	}
	dc.className='cols-names';
	this.colsNames=dc;
	this.element.appendChild(dc);
		var ddd=document.createElement('div');
	ddd.style.background="green";
	ddd.style.height="10px";
	ddd.style.width="10px";
	ddd.style.left="0px";
	ddd.style.top="0px";
	ddd.style.position="absolute";
	ddd.style.zIndex="99999999";
	this.element.appendChild(ddd);

  // controller.activate(this.handler);
}

function Tablero(){
	this.init(arguments[0])
}

Tablero.prototype = new ITablero();

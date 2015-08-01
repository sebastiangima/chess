
function IApertura(){}
IApertura.prototype = new ISgControl()
IApertura.prototype.proto='ISgControl';

IApertura.prototype.getElement = function getElement(e,o){
	switch(e) {
		case 'TEXTO':
			return this.element.querySelector('div.apertura-text');
		break;
		case 'JUGADAi':
			return this.element.querySelector('div.apertura-jugadas>div[jugada="'+o+'"]');
		break;
	}
}

IApertura.prototype.move = function move(n){
	if (chess.chesses[this.chessid].redoBuffer.length) {
		chess.chesses[this.chessid].unredo();
	}
	var i0 = this.jugada-1,
			j0 = (this.color=='blancas')?0:1,
			pieza;
	this.showExtra(i0,j0);
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

IApertura.prototype.makeLine = function makeLine(sl,name){
	var ches= chess.chesses[this.chessid];
	var coord0=ches.parseDestino(sl[0]);
	var coord1=ches.parseDestino(sl[1]);
	var dx = coord1[1]-coord0[1];
	var dy = coord1[0]-coord0[0];
	var scale = Math.sqrt(dx*dx+dy*dy);
	var angle = Math.atan(dy/dx)*180/Math.PI;
	var rect=ches.getElement('RECT_CEL',coord0);
	var tx = Math.abs(dx)*25;
	var ty = Math.abs(dy)*25;
	//var tx = scale+25;
	
	
	var div = document.createElement('DIV');
	var img=document.createElement('IMG');
	div.appendChild(img);

	img.src='images/'+name+'.png';
	div.className='fixedImage nosize';

	if (name=='line') {
		var img2 = document.createElement('img');
		img2.src='images/azul.png';
		img2.style.top = 50*(7-coord1[0])+'px';
		img2.style.left = 50*coord1[1]+'px';
		img2.className='fixedImage';
		
	}
	
	if (dx>0 && dy>0) {
		angle += 90;
		tx=tx;
		ty=ty;
	}
	else if (dx>0 && dy<0) {
		angle = -90+angle;
		tx=tx+100;
	}

	else if (dx<0 && dy<0) {
		angle = -90+angle;
		tx=tx+100;
		ty=ty+100;
	}	
	img.style['-webkit-transform']='rotateZ('+angle+'deg) scaleX('+scale+')';
	// div.style.top = ty+rect.top+'px';
	// div.style.left = tx+rect.left+'px';
	div.style.top = ty+'px';
	div.style.left = tx+'px';

	if (img2) 
		return [div,img2];
	else
		return div;
	
}

IApertura.prototype.makeFlecha = function makeFlecha(fl){
	var ches= chess.chesses[this.chessid];
	var coord0 = ches.parseDestino(fl[0]);
	var coord1 = ches.parseDestino(fl[1]);
	var dy=coord1[0]-coord0[0];
	var dx=coord1[1]-coord0[1];
	var div = document.createElement('DIV');
	var img=document.createElement('IMG');
	div.appendChild(img);
	div.className='fixedImage nosize';
	var delta=[0,0];
	switch(dy+dx*10) {
		case -19: img.src='images/flecha2.png'; delta=[-1,-2];break;
		case -8: 		img.src='images/flecha6.png'; delta=[-2,-1];break;
		case 12:	img.src='images/flecha3.png'; delta=[0,-1];break;
		case 21:	
		img.src='images/flecha7.png'; delta=[-1,0];break;
		case -21:	img.src='images/flecha5.png'; delta=[0,-2]; break;
		case 8:				img.src='images/flecha4.png'; delta=[-2,0];break;
		case -12:	img.src='images/flecha3.png'; delta=[0,-1]; break;
		case 19:		img.src='images/flecha8.png'; delta=[0,0];break;
		
	}
	console.log(dy+dx*10);
 div.style.top=(50*(7-coord0[0]+delta[0]))+'px'
 div.style.left=(50*(coord0[1]+delta[1]))+'px'
	return div;
	
}

IApertura.prototype.showExtra = function showExtra(i0,j0){
	var text=this.getElement('TEXTO');
	var div=document.getElementById('last');
	var ches= chess.chesses[this.chessid];
	if (!div) {
		div = document.createElement('div');
		ches.element.appendChild(div);
		div.className='extras';
		div.id='last';
	}
	this.cleanExtras();
	if (this.extras[i0] && this.extras[i0][j0]) {
		var cel, coord,coord1, elem, rect, rect1, width, height, a;
		for (var i in this.extras[i0][j0]) {
			switch (i) {
				case 'texto':
					var d = document.createElement('DIV');
					d.innerHTML = '<div>'+this.extras[i0][j0][i].join('<br />').replace(/sph__/g,'<span class="head">').replace(/spp__/g,'<span class="spp">').replace(/spx__/g,'<span class="porque">').replace(/spn__/g,'<span class="neg">').replace(/__sp/g,'</span>').replace(/sp__/g,'<span>')+'</div>';
					text.appendChild(d.children[0]);
					text.children[text.children.length-1].scrollIntoView()
					
				break;
				case 'cruz':
					for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
						cel = this.extras[i0][j0][i][j];
						coord=ches.parseDestino(cel);
						rect=ches.getElement('RECT_CEL',coord);
						var img=document.createElement('IMG');
						img.src='images/cruz.png';
						img.className='fixedImage';
						 // img.style.top=Math.abs(9-coord[0])*30+'px'
						 // img.style.left=Math.abs(coord[1])*25*+'px'
						 img.style.top=(50*(7-coord[0]))+'px'
						 img.style.left=(50*coord[1])+'px'
						 img.style.width='50px'
						 img.style.height='50px'
						 
						// rect.top+'px';
						// img.style.left=rect.left+'px';
						// img.style.right=rect.right+'px';
						// img.style.bottom=rect.bottom+'px';
						div.appendChild(img);
					}
				break;
				case 'line':
					for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
						var r = this.makeLine(this.extras[i0][j0][i][j],'line');
						for (var k=0; k<r.length; ++k) 
							div.appendChild(r[k]);
						continue;
						cel = this.extras[i0][j0][i][j][0];
						coord=ches.parseDestino(cel);
						rect=ches.getElement('RECT_CEL',coord);
						cel = this.extras[i0][j0][i][j][1];
						coord1=ches.parseDestino(cel);
						rect1=ches.getElement('RECT_CEL',coord1);

						var d = document.createElement('DIV');
						
						var img=document.createElement('IMG');
						d.appendChild(img);
						
						img.src='images/line.png';
						d.className='fixedImage';


						// // coord[1]-coord1[1]
						if (coord[1]<coord1[1])  {
							d.style.left=rect.left+'px';
							width=(rect1.right-rect.left);
						}
							
						else {
							d.style.left=rect1.left+'px';
							width=(rect.right-rect1.left);
						}
						if (coord[0]<coord1[0]) { 
							d.style.top=rect1.top+'px';
							height=(rect.bottom-rect1.top);
						}
						else {
							d.style.top=rect.top+'px';
							height=(rect1.bottom-rect.top);
						}
						var m=((coord[0]-coord1[0])/(coord[1]-coord1[0]))
						var dy = coord[0]-coord1[0];
						var dx = coord[1]-coord1[1];
						width=(Math.abs(dx)+1)*50;
						height=(Math.abs(dy)+1)*50;
						d.style.height=height+'px';
						d.style.width=width+'px';
						if (Math.abs(dy)==2) {
						
							if (dx>0)
								d.children[0].style['-webkit-transform']='rotateZ('+(-60*dy/2)+'deg)';
							else
								d.children[0].style['-webkit-transform']='rotateZ('+(-120*dy/2)+'deg)';
						}
						else {
							if (Math.abs(dy)==1) {
							if (dx>0)
								d.children[0].style['-webkit-transform']='rotateZ('+(-30*dy)+'deg)';
							else
								d.children[0].style['-webkit-transform']='rotateZ('+(-150*dy)+'deg)';
							}
						
						}
						
						
						div.appendChild(d);
					}
					break;
				case 'flecha':
					for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
						div.appendChild(this.makeFlecha(this.extras[i0][j0][i][j]));
						continue;
						cel = this.extras[i0][j0][i][j][0];
						coord=ches.parseDestino(cel);
						rect=ches.getElement('RECT_CEL',coord);
						cel = this.extras[i0][j0][i][j][1];
						coord1=ches.parseDestino(cel);
						rect1=ches.getElement('RECT_CEL',coord1);

						var d = document.createElement('DIV');
						
						var img=document.createElement('IMG');
						d.appendChild(img);
						
						img.src='images/flecha.png';
						d.className='fixedImage';


						// // coord[1]-coord1[1]
						if (coord[1]<coord1[1])  {
							d.style.left=rect.left+'px';
							width=(rect1.right-rect.left);
						}
							
						else {
							d.style.left=rect1.left+'px';
							width=(rect.right-rect1.left);
						}
						if (coord[0]<coord1[0]) { 
							d.style.top=rect1.top+'px';
							height=(rect.bottom-rect1.top);
						}
						else {
							d.style.top=rect.top+'px';
							height=(rect1.bottom-rect.top);
						}
						var m=((coord[0]-coord1[0])/(coord[1]-coord1[0]))
						var dy = coord[0]-coord1[0];
						var dx = coord[1]-coord1[1];
						width=(Math.abs(dx)+1)*50;
						height=(Math.abs(dy)+1)*50;
						d.style.height=height+'px';
						d.style.width=width+'px';
						if (Math.abs(dy)==2) {
						
							if (dx>0)
								d.children[0].style['-webkit-transform']='rotateZ('+(-60*dy/2)+'deg)';
							else
								d.children[0].style['-webkit-transform']='rotateZ('+(-120*dy/2)+'deg)';
						}
						else {
							if (Math.abs(dy)==1) {
							if (dx>0)
								d.children[0].style['-webkit-transform']='rotateZ('+(-30*dy)+'deg)';
							else
								d.children[0].style['-webkit-transform']='rotateZ('+(-150*dy)+'deg)';
							}
						
						}
						
						
						div.appendChild(d);
					}
					break;
				case 'sline':
					for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
						div.appendChild(this.makeLine(this.extras[i0][j0][i][j],'sline'));
						continue;
						cel = this.extras[i0][j0][i][j][0];
						coord=ches.parseDestino(cel);
						rect=ches.getElement('RECT_CEL',coord);
						cel = this.extras[i0][j0][i][j][1];
						coord1=ches.parseDestino(cel);
						rect1=ches.getElement('RECT_CEL',coord1);

						var d = document.createElement('DIV');
						
						var img=document.createElement('IMG');
						d.appendChild(img);
						
						img.src='images/sline.png';
						d.className='fixedImage nosize';


						// // coord[1]-coord1[1]
						if (coord[1]<coord1[1])  {
							d.style.left=rect.left+'px';
							width=(rect1.right-rect.left);
						}
							
						else {
							d.style.left=rect1.left+'px';
							width=(rect.right-rect1.left);
						}
						if (coord[0]<coord1[0]) { 
							d.style.top=rect1.top+'px';
							height=(rect.bottom-rect1.top);
						}
						else {
							d.style.top=rect.top+'px';
							height=(rect1.bottom-rect.top);
						}
						var m=((coord[0]-coord1[0])/(coord[1]-coord1[0]))
						var dy = coord[0]-coord1[0];
						var dx = coord[1]-coord1[1];
						width=(Math.abs(dx)+1)*50;
						height=(Math.abs(dy)+1)*50;
						d.style.height=height+'px';
						d.style.width=width+'px';
						
						if (dx==0) {
							var max=Math.abs(dy);
							var scale = ' scaleX('+(max-1)+') ';
							var ang;
							if (dy>0) {
								ang=-90;
								trans=-25;
							}
							else {
								ang=90;
								trans=30;
							}
							var trans = ' translateX('+(trans*(max-1))+'px) ';
							var rotate = ' rotateZ('+ang+'deg) ';
							d.children[0].style['-webkit-transform']=rotate+trans+scale;
							
						}
						else if (dy==0){
							var max=Math.abs(dx)-1;
							var ang=0;
							if (dx>0) {
								trans=30;
							
							}
							else {
								ang=180;
								trans=-25;
							}
							var rotate = ' rotateZ('+ang+'deg) ';
							var scale = ' scaleX('+max+') ';
							var trans = ' translateX('+(trans*max)+'px) ';
							d.children[0].style['-webkit-transform']=rotate+trans+scale;
						}
						else {
							var max = Math.abs(dy);
							if (Math.abs(dx)>max) max = Math.abs(dx);
							max = max+1;
							
							var scale = ' scaleX('+max+') ';
							var trans = 25;
							var ang = 0;
							var ay=Math.abs(dy);
							var ax=Math.abs(dx);
							var minx=(coord[1]<coord1[1])?coord[1]:coord1[1];
							minx=4-minx/2;
							ang = (Math.atan((dy+1)/(dx+1))*180/3.1415);
							if (dx<0 && dy<0)
								ang = 90+ang;
							var trans = ' translateY('+(-25*max)+'px) ';
							d.children[0].style['-webkit-transform']='rotateZ('+(ang)+'deg) '+trans+scale;
							// if (dy>=0) {
								// if (dx<0) {
								// }
								// else if (dx<0) {
									
								// }
								// else {
								// }
							// }
							// else {
								// if (dx<0) {
								// }
								// else if (dx<0) {
									
								// }
								// else {
								// }						
							
							// }
													
						}
						
						div.appendChild(d);
					}
					break;
				
			}
		}
	
	}
	
}

IApertura.prototype.cleanExtras = function cleanExtras(){
	var div=document.getElementById('last');
	while(div.children.length) {
		div.removeChild(div.children[0]);
	}
}

IApertura.prototype.moveJugada = function moveJugada(n){
	if (this.timer) this.timer=clearTimeout(this.timer);
	if (this.callNumber==0) {
		this.callNumber=1;
		this.timer = setTimeout("aperturas.move('"+n+"')",500);
		return;
	}
	else {
		this.callNumber=0;
	}
	var animate = false;
	if (n==1) {
		if (!this.lastJugada) {
			this.color = 'blancas';
			this.markJugada();
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
				this.markJugada();
				this.lastColor='blancas';
				this.lastJugada=this.jugada;
				animate='animate';
			}
			else {
				this.color='negras';
				this.lastColor='blancas';
				this.markJugada();
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
				this.markJugada();
				this.lastColor='blancas';
				this.lastJugada=this.jugada;
				animate='redo';
			}
			else {
				this.color='negras';
				this.lastColor='blancas';
				this.jugada--;
				this.markJugada();
				this.lastColor='negras';
				this.lastJugada=this.jugada;
				animate='redo';
			}
			chess.chesses[this.chessid].redo();
			this.cleanExtras();
			return;
		
	}

	this.move();
	// chess.animateOneEnabled=true; 
	// chess[animate]();
	// chess.animateOneEnabled=false; 
}

IApertura.prototype.markJugada = function markJugada(color){
	var d;
	//this.markJugada(color);
	if (this.lastJugada) {
		d = this.getElement('JUGADAi',this.lastJugada);
		if (!d) return;
		d.children[0].setAttribute('state',0);
		if (this.lastColor)
			if (this.lastColor=='blancas')
				d.children[1].setAttribute('state',0);
			else
				d.children[2].setAttribute('state',0);
	}
	d = this.getElement('JUGADAi',this.jugada);
	if (!d) return;
	d.children[0].setAttribute('state',1);
	if (this.color) {
		if (this.color=='blancas')
			d.children[1].setAttribute('state',1);
		else
			d.children[2].setAttribute('state',1);
	}
}

IApertura.prototype.htmlJugadas = function htmlJugadas(){
	var s='';
	for (var i=0; i<this.jugadas.length; ++i) {
		s+='<div jugada="'+(i+1)+'"><span>'+((i+1).toString()+'.').padRight(4)+'</span><span>'+this.jugadas[i][0].padRight(7)+'</span><span> '+this.jugadas[i][1].padRight(7)+'</span></div>'
	}
	return s;
}

IApertura.prototype.getMovedNumber = function getMovedNumber(){
	chess.chesses[this.chessid].getMovedNumber();
}

IApertura.prototype.initPanel = function initPanel(){

	var d = document.createElement('div');
	var html = '';
	var hj=this.htmlJugadas();
	html += '<div class="apertura-jugadas" jugada="1" color="blancas">';
	html += hj;
	html += '</div>';
	d.innerHTML = html;
	this.element.appendChild(d.children[0]);
	var d = document.createElement('div');
	var html = '';
	
	html += '<div class="apertura-text" jugada="1">';
	html += '</div>';
	d.innerHTML = html;
	this.element.appendChild(d.children[0]);
	// this.panel = new PanelJugadas({
		// eargs:{/*innerHTML:hj,*/parentNode:this.element,jugada:'1',color:'blancas'},
		// oargs:{ controlFlier:true,jugadas:this.jugadas,owner:this},
		// common:{id:'apertura_'+guid}
	// })
	this.markJugada();
	
		
	
}

IApertura.prototype.init = function init(){
		window[IApertura.prototype.proto].prototype.init.call(this,arguments[0],{
			eargs:{display:'block', className:'apertura'},
			oargs:{jugada:1, innited:true, callNumber:0, tablero:{}, lastJugada:0, orientacion:1, lastColor:''}
		})
		
	var args = {eargs:{}, oargs:{}, common:{}};
		args.eargs.parentNode = this.element;
		args.oargs.handler = this;
		args.common.id = 'apertura_'+guid+'_flier';
		this.flierControl = new FlierControl(args);
		chess.chesses[this.chessid].setEventListener('keydown',aperturas,'keyDown');
		chess.chesses[this.chessid].usePanel(false);
}

function Apertura(){
	this.init(arguments[0]);
}
Apertura.prototype = new IApertura();
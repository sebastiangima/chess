function IPanelJugadas(){}
IPanelJugadas.prototype = new IPanel()
IPanelJugadas.prototype.proto='IPanel';


IPanelJugadas.prototype.activate = function setActive(){
	this.element.style.zIndex=23;
	
}

IPanelJugadas.prototype.setActive = function setActive(){
	this.element.style.zIndex=23;
	this.owner.setActive();
}
IPanelJugadas.prototype.getElement = function getElement(e,o){
	switch(e) {
		case 'TEXTO':
			return this.element.querySelector('div.panel-jugadas-text');
		break;
		case 'JUGADAi':
			return this.element.querySelector('div.panel-jugadas.content>div[jugada="'+o+'"]');
		break;
	}
}

IPanelJugadas.prototype.moveMark = function moveMark(	){
	var v=this.owner.jugadaInfo
	if (this.element.lastElementChild) {
		var vd=this.element.lastElementChild.querySelectorAll('[state="1"]')
			for (var i=0; i<vd.length; ++i) {
				vd[i].setAttribute('state',0);
			}
	}
	
	if (v && v.length) {
		var info={}
		var nj=v[v.length-1][0].numero-1
		nj=Math.floor(nj/2)+1
		var co=v[v.length-1][0].color;
		var dnj=0;
		
		
		d = this.getElement('JUGADAi',nj);
		if(d && d.children[0]) {
			d.children[0].setAttribute('state',1);
			if(d.children.length>1)
				d.children[co=='blancas'?1:2].setAttribute('state',1);
		}
		// this.markJugada({color:co,numero:nj})
	}
}

IPanelJugadas.prototype.markJugada = function markJugada(info	){
	var d;
	if (this.owner.lastJugada) {
		// d = this.getElement('JUGADAi',this.owner.lastJugada);
		// if (!d) return;
		// d.children[0].setAttribute('state',0);
		// if (this.owner.lastColor)
			// if (this.owner.lastColor=='blancas')
				// d.children[1].setAttribute('state',0);
			// else
				// d.children[2].setAttribute('state',0);
	}
	var nj = this.owner.getMovedNumber()+1;
	if (info && info.numero) nj =  info.numero + (info.color=='blancas'?1:0);
	var color = info && info.color ? info.color : info;
	// if(this.owner.redoBuffer.length) {
		// nj=nj-this.owner.redoBuffer.length;
		// if(this.owner.redoBuffer.length%2==1){
			// color=color=='blancas'?'negras':'blancas'
		// }
	// }
	d = this.getElement('JUGADAi',Math.floor(nj/2));

	if (!d) return;
	if (d.children.length==1) d=d.children[0];
	
	var vd=d.parentNode.querySelectorAll('[state="1"]');
	for (var i=0; i<vd.length; ++i) {
		vd[i].setAttribute('state',0);
	}
	
	if (color=='negras') {
		d.children[2].setAttribute('state',1);
		if (d.previusSibling) {
			d.previusSibling.children[1].setAttribute('state',0);
		}
	}
	else if (color=='blancas') {
		d.children[1].setAttribute('state',1);
		if (d.previusSibling) {
			d.previusSibling.children[2].setAttribute('state',0);
			d.previusSibling.children[0].setAttribute('state',0);
		}
	}
	d.children[0].setAttribute('state',1);
	d.scrollIntoView();	
	var nc;
	if (this.owner.color) {
		if (this.owner.color=='blancas')
			// d.children[1].setAttribute('state',1);
			nc=1
		else
			nc=2;
	}
	// d.children[0].children[nc].setAttribute('state',1);
	// d.children[0].children[nc],scrollIntoView()
}

IPanelJugadas.prototype.reset = function reset(){
	while(this.jugadas.length) {
		delete this.jugadas.pop()
	}
	this.jugadas=[]
	var d = this.element.querySelector('.panel-jugadas.content');
	d.innerHTML=this.htmlJugadas();
}
IPanelJugadas.prototype.set = function set(panelJugadas){
	var jugadas = panelJugadas.jugadas
	if(!this.jugadas) 
		this.jugadas=[];
	else 
		this.reset();
	
	for(var i=0; i<jugadas.length; ++i) {	// el turno de los 2 jugadores estan en una jugada
		this.jugadas.push([jugadas[i][0],jugadas[i][1]]);
	}
	this.jugada=panelJugadas.jugada
	var d = this.element.querySelector('.panel-jugadas.content');
	d.innerHTML=this.htmlJugadas();
	var j=null;
	if(this.jugadas && this.jugadas.length) {
		j=this.jugadas[this.jugadas.length-1];
	}
	var nj=this.jugadas.length;
	if(j) {
		if(j[1].replace(/[ ]*/,'')==''){
			color='blancas'
			nj=nj*2-1
		}
		else{
			nj=nj*2
			color='negras'
		}
		this.markJugada({color:color,numero:nj});	
	}
}
IPanelJugadas.prototype.setJugadas = function setJugadas(jugadas){
	if(!this.jugadas) this.jugadas=[];
	else this.jugadas.splice(this.jugadas.length)
	this.reset();
	for (var i=0; i<jugadas.length; ++i)
		if (i%2==0)
			this.jugadas.push([jugadas[i],'']);
		else
			this.jugadas[this.jugadas.length-1][1]=jugadas[i];
	
	var d = this.element.querySelector('.panel-jugadas.content');
	d.innerHTML=this.htmlJugadas();
	var n=jugadas.length;
	var c=n%2==0?'negras':'blancas';
	this.markJugada({numero:n,color:c});
	
	
}
IPanelJugadas.prototype.updateJugada = function updateJugada(color,info){
	var nj = Math.floor((info.numero-1)/2)
	
  if (info.numero%2==0) color='negras'; else color='blancas';
	if (info && info.color && color) info.color=color;
	if (color=='blancas' || this.jugadas.length==nj || nj==-1)
		this.jugadas.push([info.jugada,' ']);
	else
		this.jugadas[nj][1]=info.jugada;
	
	var d = this.element.querySelector('.panel-jugadas.content');

	d.innerHTML=this.htmlJugadas();
	this.markJugada(info);	
	/*
	if (color=='negras') {
		var dd=d.querySelector('div[jugada="'+(this.owner.jugada)+'"]');
		var sp=document.createElement('span');
		sp.innerHTML = this.jugadas[this.owner.jugada][1].padRight(7);
		dd.appendChild(sp);
	}
	else {
		var dd=d.querySelector('div[jugada="'+(this.owner.jugada)+'"]');
		s+='<div jugada="'+(this.owner.jugada)+'"><span>'+((this.owner.jugada).toString()+'.').padRight(4)+'</span><span>'+this.jugadas[this.owner.jugada][0].padRight(7)+'</span></div>'		
		
	}
	*/
}

IPanelJugadas.prototype.htmlJugadas = function htmlJugadas(){
	var s='';
	for (var i=0; i<this.jugadas.length; ++i) {
		s+='<div jugada="'+(i+1)+'"><span>'+((i+1).toString()+'.').padRight(4)+'</span><span>'+this.jugadas[i][0].padRight(7)+'</span><span> '+this.jugadas[i][1].padRight(7)+'</span></div>'
	}
	return s;
}

IPanelJugadas.prototype.initPanel = function initPanel(){
	var html = '';
	html += '<div class="panel-jugadas content" jugada="1" color="blancas">'
	html += this.htmlJugadas();
	html += '</div>';
	var d = document.createElement('div');
	d.innerHTML=html;
	
	this.element.appendChild(d.children[0]);
	//this.markJugada();
	
}


IPanelJugadas.prototype.init = function init(){
	var args = arguments[0] || {eargs:{},oargs:{},common:{}};
	
	args.eargs.className+=' panel-jugadas';
	window[IPanelJugadas.prototype.proto].prototype.init.call(this,args);
	
	this.initPanel();
}

function PanelJugadas(){
	this.init(arguments[0]);
}
PanelJugadas.prototype = new IPanelJugadas();
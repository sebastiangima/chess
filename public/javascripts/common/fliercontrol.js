function IFlierControl(){}
IFlierControl.prototype = new ISgControl()
IFlierControl.prototype.proto='ISgControl';


IFlierControl.prototype.getElement = function getElement(e,o) {
	switch(e) {
		case 'MASK':
			return this.mask;
		break;
		case 'CONTEXT-MENU':
			return this.contextMenu;
		break;

	}
}


IFlierControl.prototype.oncontextmenu = function oncontextmenu(e,o) {
	this.contextMenu.setAttribute('state',1-this.contextMenu.getAttribute('state'));
}

IFlierControl.prototype.dblclick = function dblclick(e,o) {
	this.handler.percentAttach();
}

IFlierControl.prototype.mousedown = function mouseDown(e,o) {
	this.mask.setAttribute('state',1);
	this.element.setAttribute('state',1);
	this.rect = this.handler.element.getClientRects()[0];
	// this.rect.left -= e.screenX;
	// this.rect.top -= e.screenY;
	
	var vs=sgc.findControl({type:'ITablerito',siblings:this.handler.internalGUID})
	var rs=[];
	for(var i=0; i<vs.length; ++i) {
		rs.push(vs[i].ctrl.element.getClientRects()[0])
	}

	this.mouseCoord = {y:e.clientY,x:e.clientX};
	console.log(e.pageX,e.pageY,e.clientX,e.clientY,e.screenX,e.screenY,e.x,e.y,this.rect.left,this.rect.top,this.mouseCoord,this.element)
	flier.setHandler(['mouseup','mousemove'],this,this.mouseCoord);
		for(var i=0; i<vs.length;++i) {
		// vs[i].ctrl.moveElementTo(0,0)
		var position=getComputedStyle(vs[i].ctrl.element).position
		switch(position) {
			case 'absolute':
			case 'fixed':
			
			continue;
			break;
		}
		
		 vs[i].ctrl.moveElementTo(rs[i].left,rs[i].top,false)
		
	}
}

IFlierControl.prototype.mouseup = function mouseup(e,o,delta) {
	controller.cancelDelay();
	this.mask.setAttribute('state',0);
	this.element.setAttribute('state',0);
	return true;
}

IFlierControl.prototype.mousemove = function mousemove(e,o,delta) {
	console.log([this.rect,delta,e,this.handler.element.getClientRects()[0]])
	var r=this.handler.element.getClientRects()[0];
	if(this.rect.left!=r.left) 
		delta[1]=+delta[1]+this.rect.left-r.left
	else 
		delta[1]=+delta[1]
	if(this.rect.top!=r.top) 
		delta[0]=+delta[0]+this.rect.top-r.top
	else 
		delta[0]=+delta[0]
	this.handler.moveElementTo(delta[1],delta[0]);
	// this.handler.moveElementDelta(+delta[1],+delta[0]);
	// this.handler.moveElementTo(+this.rect.left,+this.rect.top);
	// this.handler.moveElementTo(+this.rect.left+(+delta[1]),+this.rect.top+(+delta[0]));
	// this.handler.moveElementTo(+this.rect.left+(+delta[1]),+this.rect.top+(+delta[0]));
}

IFlierControl.prototype.initFlier = function initFlier() {
	var d=document.createElement('DIV');
	d.className = 'flier-mask';
	d.id=this.id+'_mask'+guid;
	this.handler.element.appendChild(d);
	this.mask=d;

	var html = '';
	var d = document.createElement('div');
	html += '<div class="flier-context-menu" state="0">';
	// html += 	'<div>';
	// html += 		'<div><input>1</input><span>opacidad</span></div>';
	// html += 		'<div><input>1</input><span>coord x</span></div>';
	// html += 		'<div><input>1</input><span>coord y</span></div>';
	// html += 		'<div><input>1</input><span>ancho</span></div>';
	// html += 		'<div><input>1</input><span>alto</span></div>';
	// html += 	'</div>';
	html += '</div>';
	
	d.innerHTML=html;
	this.contextMenu=d.children[0];
	d = d.children[0];
	this.handler.element.appendChild(d);
	
	new SliderControl({eargs:{className:'opacidad', parentNode:d},oargs:{max:1, min:0},common:{label:'opacidad',value:1}});
	new SliderControl({eargs:{className:'alto', parentNode:d, top: '40px'},oargs:{max:1, min:0},common:{label:'opacidad',value:1}});
	new SliderControl({eargs:{className:'ancho', parentNode:d, top: '80px'},oargs:{max:1, min:0},common:{label:'opacidad',value:1}});
	
	var r = this.contextMenu.getClientRects()[0];
	if (r && r.left<0) {
			this.contextMenu.style.marginLeft-(340-(+r.left.replace('px','')))+'px';
			//this.contextMenu.style.marginLeft.left='0px';
		
		// for (var i=0; i<this.contextMenu.children.length; ++i) {
			// this.contextMenu.style.marginLeft-(340-(+r.left.replace('px','')))+'px';
			//this.contextMenu.children[i].style.left='0px';
		// }
	}
}

IFlierControl.prototype.initCapturer = function initCapturer() {
	flier.init();
}
	
IFlierControl.prototype.init = function init() {
	var oargs = arguments[0].oargs || {},
			eargs = arguments[0].eargs || {},
			common = arguments[0].common || {};
		eargs.className += ' flier-control';
		
		var this_=this;
		common.guid = 'FLIER_'+guid;
		
		eargs.oncontextmenu = function(){
			this_.oncontextmenu(arguments[0],arguments[1]);
			
			return cancelEvent(arguments[0]);
		}
		
		eargs.onmousedown = function(){
			if (arguments[0].button==2) 
				return cancelEvent(arguments[0]);
			
			if (!arguments[0] || !arguments[0].sg) {
				if (this_.handler && this_.handler.activate)
					controller.activate(this_.handler);
				controller.delayEvent(arguments[0],arguments[1],'onmousedown');
				return false;
			}
			this_.mousedown(arguments[0],this);
		}
		eargs.ondblclick = function() {
			this_.dblclick(arguments[0],this);
		}
		window[IFlierControl.prototype.proto].prototype.init.call(this,{},{
			'eargs':eargs,
			'oargs':oargs,
			'common':common
		})
	
	this.initFlier();
	this.initCapturer();
	

	
}


function FlierControl(){
	this.init(arguments[0]);
}

FlierControl.prototype = new IFlierControl();
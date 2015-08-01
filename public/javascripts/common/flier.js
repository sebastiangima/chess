var flier = (function(){
  var instance = null;
	
	Flier.prototype.setHandler = function setHandler(e,h,c){
		if (!(e instanceof Array)) {
			e = [e];
		}
		this.handlers[h.guid]={'handler':h, events:[],coord:c};
		for (var i=0; i<e.length; ++i) {
			this.listeners[e[i]].push(h.guid);
			this.handlers[h.guid].events.push(e[i]);
		}
		if (this.element.parentNode!=null) {
			this.element.parentNode.removeChild(this.element);
		}
		document.body.appendChild(this.element);	
		this.element.setAttribute('active',1);
	}
	
	Flier.prototype.mouseMove = function mouseMove(e,o){
		if (e && e.preventDefault) e.preventDefault();
		var result = this.dispatch(e,o);
		if (result)
			stopEvent(e);
		return true;
	}
	

	Flier.prototype.mouseUp = function mouseUp(e,o){
		var result = this.dispatch(e,o);
		if (result) {
			stopEvent(e);
		}
		return true;
		
	}
	
	Flier.prototype.removeListener = function removeListener(h){
		var v = this.handlers[h.guid].events;
		var e, listo=false;
		for (var i=0; i<v.length; ++i) {
			for (var j=0; j<this.listeners[v[i]].length; ++j) {
				if (this.listeners[v[i]][j]==h.guid) {
					this.listeners[v[i]].splice(j,1);
					listo=true;
					break;
				}
			}
			if (listo) {
				listo=false;
				continue;
			}
		}
		this.element.parentNode.removeChild(this.element);

	}
	
	Flier.prototype.dispatchEvent = function dispatchEvent(e,o,h){
		var dx=0,dy=0;
		if (this.handlers[h.guid].coord) {
			dx=e.clientX-this.handlers[h.guid].coord.x;
			dy=e.clientY-this.handlers[h.guid].coord.y;
		}
		return h[e.type](e,o,[dy,dx]);
		

	}
	
	Flier.prototype.dispatch= function dispatch(e,o){
		var h, vh;
		vh=this.listeners[e.type];
		var n=vh.length-1;
		h = this.handlers[vh[n]];
		while(h) {
			result = this.dispatchEvent(e,o,h.handler);
			if (result) {
				this.removeListener(h.handler);
				return result;
			}
			if (n--) break;
			h = this.handlers[vh[n]];
		}
		return false;
		
	}
	
	Flier.prototype.init = function init(){
		if (this.initted)
			return;
		d = document.createElement('div'),
		d.className = 'flier-capturer';
		document.body.appendChild(d);
		d.onmouseup = function() {
			return flier.mouseUp(arguments[0],this);
		}
		d.onmousemove = function() {
			return flier.mouseMove(arguments[0],this);
		}
		this.element = d;
		this.listeners={
			mousedown:[],
			mousemove:[],
			mouseup:[],
			click:[],
			keydown:[],
			keyup:[],
			keypress:[]
		}
		this.handlers={};
		this.initted=true;
		
	}
	function Flier(){
		this.initted=false;
	}
  return instance ? instance : instance = new Flier();
})()
function IBaseObject(){}
IBaseObject.prototype = 
function IObject(){}
function IObjectChild(){}


function efectos(n){
	switch(n) {
		case 1:
		break;
	}
}

function ISgObject(){}


ISgObject.prototype.propertyMap = function propertyMap(p){
	for (var i in p) {
		this[i]=p[i];
	}
}


ISgObject.prototype.getAllPropertyNames = function getAllPropertyNames(){
	var o = Object.getPrototypeOf(this);
	var v={}, w=[];
	while(o) {
		for (var i in o) {
			if (!v[i]) {
				w.push(i);
				v[i]=1;
			}
		}
		o = Object.getPrototypeOf(o);
	}
	var p = this.getOwnPropertyNames();
	for (var i=0; i<p.length; ++i) {
		if (!v[p[i]]) {
			w.push(p[i]);
			v[p[i]]=1;
		}
	}
	return w;
}

ISgObject.prototype.getOwnPropertyNames = function getOwnPropertyNames(){
	return Object.getOwnPropertyNames(this);
}
ISgObject.prototype.hasOwnProperty = function hasOwnProperty(p){
	return Object.hasOwnProperty.call(this,p);
}

ISgObject.prototype.destroy = function destroy(){
}
var objectCloned={};
ISgObject.prototype.clone = function clone(recursion){

	if (!recursion)
		objectCloned={};
	if (objectCloned[this.internalGUID])
		return objectCloned[this.internalGUID];
	var p=this.getAllPropertyNames();
	var oo = function(){};
	oo.prototype = Object.getPrototypeOf(this);
	var o = new oo();
		
	objectCloned[this.internalGUID]=o;
	for (var i=0; i<p.length; ++i) {
		if (this[p[i]]===null)
			o[p[i]]=null;
		else if (typeof(this[p[i]])=='undefined')
		{}
		else {
			switch (typeof(this[p[i]])){
				case 'undefined': 
				case 'number': 
				case 'boolean': 
				case 'string': 
					o[p[i]]=this[p[i]]; 
				break;
				default:
					if (this[p[i]] instanceof Function) {
					}
					else if (this[p[i]] instanceof Array) {
						o[p[i]]=makeClone(this[p[i]],true);
					}
					else {
						if (o[p[i]] instanceof ISgObject)
							o[p[i]] = this[p[i]].clone(true);
						else
							o[p[i]] = makeClone(this[p[i]],true);
						
					}
				break;
			}
		}
		
	}
	return o;
}

ISgObject.prototype.init = function init(p){
	this.internalGUID = ''+guid;
	this.propertyMap(p);
}

function SgObject(){
	
}

SgObject.prototype=new ISgObject();



function ISgControl(){}

ISgControl.prototype = new ISgObject();

function makeClone(o,recursion) {
	var result;
	if (!recursion) {
		objectCloned={};
	}
	if (o===null) result=null;
	else if (typeof(o)=='undefined') {}
	else {
		if (o instanceof ISgObject) {
			if (objectCloned[o.internalGUID])
				result = objectCloned[o.internalGUID];
			else {
				result = o.clone(true);
				objectCloned[o.internalGUID]=result;
			}
		}
		else {
			switch(typeof(o)) {
				case 'number':
				case 'string':
				case 'boolean':
					result=o;
				break;
				default:
					if (o instanceof Function) {
						return o;
					}
					else if (o instanceof Array) {
						result = [];
						for (var i=0; i<o.length; ++i) {
							result.push(makeClone(o[i],true));
						}
					}
					else if (o instanceof Object) {
							if (o instanceof HTMLElement) {
								return o.cloneNode(true);
							}
							result = {};
							for (var i in o) {
								result[i] = makeClone(o[i],true);
							}
						
					}
				break;
			}
		}
	}
	return result;
	
	
}
ISgControl.prototype.mergeArgs = function mergeArgs(gargs,pargs){
	var eargs = gargs && gargs.eargs ? gargs.eargs : {}
	var oargs = gargs && gargs.oargs ? gargs.oargs : {}
	var common = gargs && gargs.common ? gargs.common : {}
	if (pargs) {
		if (pargs.eargs) {
			for (var i in pargs.eargs) {
				if (i=='className') 
					eargs[i]=eargs[i]+' '+pargs.eargs[i];
				else
					eargs[i]=pargs.eargs[i];
			}
		}
		if (pargs.oargs) {
			for (var i in pargs.oargs) {
				oargs[i]=pargs.oargs[i]
			}
		}
		if (pargs.common) {
			for (var i in pargs.common) {
				common[i]=pargs.common[i]
			}
		}
	}
	return {'eargs':eargs, 'oargs':oargs, 'common':common}
}

ISgControl.prototype.deactivate = function deactivate(x,y){
	this.element.style.zIndex = 5;
	this.active=false;
}

ISgControl.prototype.activate = function activate(x,y){
	controller.activate(this);
}

ISgControl.prototype.setActive = function setActive(x,y){
	this.element.style.zIndex = 23;
	this.active=true;
	if (this.handler && this.handler.activate && this.handler!=this) {
		this.handler.activate();
	}
}

ISgControl.prototype.percentAttach = function percentAttach(x,y){
	var rb=document.body.getClientRects()[0];
	var re=this.element.getClientRects()[0];
	var pw=(re.left/rb.width)*100;
	var ph=(re.top/rb.height)*100;
	this.element.style.top=ph+'%';
	this.element.style.left=pw+'%';
}

ISgControl.prototype.moveElementDelta = function moveElementDelta(dx,dy){
	var element;
	var scaled=1;
  scaled = this.scaled?this.scaled:1;
	if (this.realContainer) {
		if (scaled==2) scaled=1;
		element = this.realContainer;
	}
	else {
		element=this.element
	}
	// console.log(x,y,
	var r = element.getClientRects()[0];
	element.style.position='fixed';
	
	element.style.bottom = 'auto';
	element.style.right = 'auto';
	// element.style.left = r.left+x*scaled+'px';
	element.style.left = r.left+x+'px';
	element.style.top = r.top+y+'px';
}

ISgControl.prototype.moveElementTo = function moveElementTo(x,y,fixed){
	var element;
	var scaled=1;
  scaled = this.scaled?this.scaled:1;
	if (this.realContainer) {
		if (scaled==2) scaled=1;
		element = this.realContainer;
	}
	else {
		element=this.element
	}
	// console.log(x,y,
	var r = element.getClientRects()[0];
	 // element.style.position='fixed';
	 element.style.position=fixed?'fixed':'absolute';
	if(fixed) {
		element.style.marginLeft=0;
		element.style.marginTop=0;
	}
	element.style.bottom = 'auto';
	element.style.right = 'auto';
	element.style.left = x*scaled+'px';
	element.style.top = y*scaled+'px';
	
}

ISgControl.prototype.init = function init(gargs,pargs){
	var args = this.mergeArgs(gargs,pargs);
	var eargs = args.eargs;
	var oargs = args.oargs;
	var common = args.common;

	for (var i in common) {
		eargs[i]=oargs[i]=common[i];
	}
	
	ISgObject.prototype.init.call(this,oargs);
	//this.propertyMap(oargs);
	// for (var i in oargs) {
		// this[i]=oargs[i];
	// }
	
	this.element = sgCreateNode('DIV',eargs);
	if (this.controlFlier) {
		var args = {
			eargs:{parentNode:this.element},
			oargs:{handler:this.handler?this.handler:this},
			common:{d: (this.id?this.id:this.guid?this.guid:'GUID')+'_'+guid}
		}
		this.controlFlier = new FlierControl(args);
	}
	
}

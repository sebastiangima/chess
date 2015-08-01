/*	expresion regular para el extraer los caracteres no numéricos presentes en una cadena */
var regexcssval=/[^0-9\.]/g;

function defaultHanler(){
	return;
}

var domHelper = (function(){

	var instance = null;

	DomHelper.prototype.mouseData;

	DomHelper.prototype.inittedto;

	DomHelper.prototype.fromObject_ = function fromObject_(o,l){
		var result='', t, tab = '&nbsp;&nbsp;', tabs = '', sl='<br />', r='';
		
		for (var i=0; i<l; ++i) tabs+=tab;

		++l;

		if (o instanceof Object && o.constructor.name == 'Object') {
			r+=sl;
			for (var i in o) {
				r += tabs+i+': '+this.fromObject_(o[i],l+1);
			}
		}
		else if (typeof(o)=='undefined') {
			r = '<span style="color:blue">undefined</span>';
		}
		else if (o===null) {
			r = '<span style="color:blue">null</span>';
		}
		else {
			switch(typeof(o)) {
				case 'number':
				case 'string':
				case 'boolean':
					r = '<span style="color:red">'+o.toString()+'</span>';
				break;
				default:
					if (o instanceof Function){
					}
					else if (o instanceof Array){
						for (var i=0; i<o.length; ++i) {
							r += tabs+'['+i+'] = '+this.fromObject_(o[i],l);
						}
						
					}
					else if (o instanceof Object) {
						r+=sl;
						for (var i in o) {
							r += tabs+i+': '+this.fromObject_(o[i],l);
						}
					}
					else {
						r = tabs+o.toString();
					}
				break;
			}
		}
		--l;
		result=r+sl;
		return result;
	}

	DomHelper.prototype.fromObject = function fromObject(o){
		return this.fromObject_(o,0);
	}
	
	DomHelper.prototype.div=function div() {
		return this.createElement('div',arguments[0])
		var args = arguments[0] ? arguments[0] : null,
		d = this.createElement('DIV');
		d.onselectstart = function() { return false; }
		d.onselect = function() { return false; }
		d.onselectchange = function() { return false; }
		return d;
	}

	DomHelper.prototype.getComputed=function getComputed(o,s) {
		var result = {};
		for (var i=0; i<s.length; ++i) {
			result[s[i]]=('' || window.getComputedStyle(o, null).getPropertyValue('left'));
		}
		return result;
	}

	DomHelper.prototype.createElement=function createElement() {
		var args = arguments[1] ? arguments[1] : {};
		var tagName=arguments[0] && arguments[0].tagName ? arguments[0].tagName : 'div';
	         
		var d =this.sg.fn[0][this.sg.fn[1]](tagName);
		
		if (!args.onselect)
			args.onselect = function() {return true};
		if (!args.onselectStart)
			args.onselectStart = function(){return true;}
		if (!args.onselectchange)
			args.onselectStart = function(){return true;}
		this.mapToElement(d,args)
		
		return  d;
			
}
	
	DomHelper.prototype.createCapturer=function prepareCapturer() {
		this.capturer = domHelper.div();
		this.capturer.id = 'DomHelper';
		this.capturer.className = 'domhelper capturer';
		document.body.appendChild(this.capturer);
		return this.capturer;
	}
	
	DomHelper.prototype.stopCapturer=function stopCapturer(e,o,m,c) {
		//this.capturer.setAttribute('active','0')
		this.capturer=this.capturer.parentNode.removeChild(this.capturer)
	}
	
	DomHelper.prototype.startCapturer=function startCapturer(e,o,m,c,x) {
		if (!x) x='startDrag';
		this.action=x;
		e.preventDefault();
		if (!this.initted) this.createCapturer();
		if (!this.capturer.parentNode)
			document.body.appendChild(this.capturer);
		
		this.initted = true;
		this.mouseData = {
			top: c.element.offsetTop,
			left: c.element.offsetLeft,
			stop: ('' || o.style.top).replace(/[^0-9\.]/g,''),
			sleft: ('' || o.style.left).replace(/[^0-9\.]/g,''),
			mleft: ('' || o.style.marginLeft).replace(/[^0-9\.]/g,''),
			mtop: ('' || o.style.marginTop).replace(/[^0-9\.]/g,''),
			mousetop: e.clientY,
			mouseleft: e.clientX,
			rect: o.getClientRects(),
			button: e.button
		}
		
		var this_=this;
			toogle(this.capturer,'active');
			this.capturer.toogle = function(){
				alert('CapturerAlreadyExist' + this_.capturer.toogle('active'));
			}
		
		this.capturer.parentNode.appendChild(this.capturer);
		//alert('startCapturer:' + this.capturer);
		this.capturer.onmouseup = function(){ 
			//alert('DomHelper.capturer.onmouseup');
			domHelper.stopCapturer();
			return c.onMouseUp(event,arguments[0]);
		}
		this.capturer.onmousemove = function(){ 
			var top = arguments[0].clientY,		// coordenadas del puntero del mouse
					left = arguments[0].clientX,
					xtop =top-domHelper.mouseData.mousetop,
					xleft =left-domHelper.mouseData.mouseleft;
	
			if (this_.action=='startDrag') {
				if (left<=5) {
					return c.resizeToLeft(top,left);
				}
				if (left>=document.body.clientWidth-30) 
					return c.resizeToRight(top,left)
			return c.move({'top': xtop, 'left': xleft});
			}
			else if (this_.action=='startSlide') {
				return c.onMouseMove(top,left)
			}
			
			// resizing box container
			return  c.resize(arguments[0],arguments[1],m,c);
		}	
	}
	
	DomHelper.prototype.startDrag=function startDrag(e,o,m,c) {
		this.startCapturer(e,o,m,c);
	}

	DomHelper.prototype.startResize=function startResize(e,o,m,c) {
		return this.startCapturer(e,o,m,c,'startResize');
	}

	DomHelper.prototype.startSlide=function startSlide(e,o,m,c) {
		return this.startCapturer(e,o,m,c,'startSlide');
	}	
	
	DomHelper.prototype.mergeClassName=function mergeClassName(cn0,cn1){
		var vcn=[], ocn={};
		var r='';
		if (!cn0) return cn1;
		if (cn0 && cn0.length>0) {
			vcn = cn0.split(' ');
			for (var i=0; i<vcn.length; ++i) 
				if (!ocn[vcn[i]]) ocn[vcn[i]]=1;
		}
		if (cn1 && cn1.length>0) {
			vcn=cn1.split(' ');
			for (var i=0; i<vcn.length; ++i) 
				if (!ocn[vcn[i]]) ocn[vcn[i]]=1;
		}
		for (var i in ocn) {
			if (r) r+= ' ';
			r+=i;
		}
		return r;
		
	}

	DomHelper.prototype.mapAttributeToElement=function mapAttributeToElement(e,an,av){
		
		switch (an) {
			case 'toogle':
				// si an==toogle, => av deben ser de la forma:
				// av = {
				//   attribute: 'ATTRIBUTENAME' (default:toogle),
				//   value: 0 o 1 (default=0),
				//   triggerOn: event name to bind handler (default: onclick)
				//   strmsg: si null, msg se inicializa con el nombre del attributo
				//				sino debe ser el json de un objeto
				//   handler = function(event,elemento,strmsg) {}
				// } 
				// también se acepta que sea un array de objetos de la forma anterior
				var atn, atv, eh={}, em={}, veh={}, tomaps;
				if (!(av instanceof Array))
					av = [av];
				for (var i=0; i<av.length; ++i) {
					tomaps = {};
					atn = av[i].attribute ? av[i].attribute : '_toogle';
					atv = av[i].value ? av[i].value : 0;
					
					if (av[i].triggerOn) et = av[i].triggerOn;
					else {
						switch (atn) {
							case 'dactive': 
								et = 'ondblclick'; 
								em.dblclick = av[i].strmsg ? av[i].strmsg : atn;
								eh = av[i].handler && av[i].handler instanceof Function ? eh=av[i].handler : defaultHanler;
								veh.dblclick=eh
								
							break;
							case 'lastkey': 
								et = 'onkeydown'; 
								em.onkeydown = av[i].strmsg ? av[i].strmsg : atn;
								eh = av[i].handler && av[i].handler instanceof Function ? eh=av[i].handler : defaultHanler;
								veh.keydow=eh
							break;
							case 'ractive': 
								et = 'oncontextmenu'; 
								em.contextmenu = av[i].strmsg ? av[i].strmsg : atn;
								eh = av[i].handler && av[i].handler instanceof Function ? eh=av[i].handler : defaultHanler;
								veh.contextmenu=eh;
							break;
							default: 
								et = 'onclick'; 
								em.click = av[i].strmsg ? av[i].strmsg : atn;
								eh = av[i].handler && av[i].handler instanceof Function ? eh=av[i].handler : defaultHanler;
								veh.click=eh
							break;						
						}
					}
					tomaps[atn]=atv;
					tomaps[et]=function() {
						return veh[arguments[0].type](arguments[0],arguments[1],em[arguments[0].type]);
						//return eh	[em[arguments[0].type]](arguments[0],arguments[1],em[arguments[0].type]);
					}
					this.mapToElement(e,tomaps);
				}
				return;
			break;
			default:
				e.setAttribute(an,av);
			break;
		}
		e.setAttribute(an,av);
	}

	DomHelper.prototype.mapPropertyToElement=function mapPropertyToElement(e,pn,pv){
		switch(pn) {
			case 'class': e.className=pv; break;
			case 'parent': 
			case 'parentNode': 
				pv.appendChild(e); break;
			default: e[pn]=pv; break;
		}
	}

	DomHelper.prototype.mapStyleToElement=function mapStyleToElement(e,sn,sv){
		switch(sn) {
			case 'imageUrl': 
				if (/^ico.*\.png$/i.test(sv))
					e.style.backgroundImage="url('./img/icons/"+sv+"')"; 
				else
					e.style.backgroundImage="url('./img/"+sv+"')"; 
				break;
			default:
				e.style[sn]=sv;
			break;
		}
	}

	DomHelper.prototype.getAppliedRules = function getAppliedRules(node) {
		var c = node.classList
		var rules=[];
		
		if (!window.getMatchedCSSRules) {
			var v=['height','width','left','top','bottom','right','margin-top','margin-right','margin-left','margin-bottom'];
			var st={};
			if (node.currentStyle) {
				for (var i=0; i<v.length; ++i) {
					st[v[i]]=node.currentStyle[v[i].toCamelCase()];
				}
			}
			else {
				st.height=node.clientHeight+'px';
				st.width=node.clientHeight+'px';
				var n = node;
				while (n && node.tagName!='BODY') {
					n = n.parentNode 
				}
				
				
			}
			rules.push({style:st});
			return rules;
		}
    var r = window.getMatchedCSSRules(node, '');
    var i = r.length;
    while (i--) {
      rules.push(r[i]);
    }
    return rules;
  }
	
	DomHelper.prototype.getAppliedStyles=function getAppliedStyles(o,s) {
		if (!s) s=['height','width','left','top','bottom','right','margin-top','margin-right','margin-left','margin-bottom'];
		if (!o) o=document.getElementById('app_1');
		var rules = this.getAppliedRules(o);
		var r={};
		
		for (var i=0; i<s.length; ++i) {
			r[s[i]]='';
			for (var j=0; j<rules.length; ++j) {
				if (rules[j].style[s[i]]!='') {
					r[s[i]]=rules[j].style[s[i]];
					
					break;
				}
			}
		}
		if (s.length==1)
			return r[s[0]];
		return r;
	}
	
	DomHelper.prototype.mapMethodToElement=function mapMethodToElement(e,mn,mv){
		e[mn]=function() {
			if (domHelper.captureEvents[arguments[0].type]) {
				var o = this;
				while(o) {
					if (o!=domHelper.capturerHandler) {
						if (o==document.body) 
							return;
						o=o.parentNode;
					}
					else
						break;
				}
			}
				mv(arguments[0],this);
		}
	}

	DomHelper.prototype.WK = {
		isHtmlElement : function isHtmlElement(e){
			return e instanceof HTMLElement;
		}
	}

	DomHelper.prototype.IE = {
		isHtmlElement : function isHtmlElement(e){
			return e && e.nodeType && e.nodeType==3;
		}
	}

	DomHelper.prototype.isHtmlElement = function isHtmlElement(e){
		return this[this.allfb].isHtmlElement(e);
	}
	
	DomHelper.prototype.unsetCapturer = function unsetCapturer(events) {
		for (var i=0; i<events.length; ++i) {
			this.captureEvents[events[i]]=0;
		}
	}

	DomHelper.prototype.setCapturer = function setCapturer(events,o) {
		for (var i in events) {
			this.captureEvents[events[i]]=1;
		}
			this.capturerHandler=o;
	}

	DomHelper.prototype.removeClass = function removeClass(e,c){
		var cn = e.className, vcn;
		if (cn!=='') {
			vcn = cn.split(' ');
		}
		else vcn=[];
		cn='';
		for (var i=0; i<vcn.length; ++i) {
			if (vcn[i]!=c) {
				cn += vcn[i]+' ';
			}
		}
		this.mapToElement(e,{className:cn});
	}
	
	DomHelper.prototype.addClass = function addClass(e,c){
		e.className = this.mergeClassName(e.className, c);
	}
	
	DomHelper.prototype.mapToElement = function mapToElement(e,v){
		var t;
		for (var i in v) {
			t=typeof(v[i]);
			if (t=='string' || t=='number' || this.isHtmlElement(v[i])||  v[i] instanceof Function)
				switch(i.toLowerCase()) {
					case 'imgsrc':
						var img = sgCreateNode('IMG',{parentNode:e});
						img.src = v[i];
					break;
					case 'classname':
						v[i]=v[i].replace(/undefined/g,'').trim()
					case 'id':
					case 'value': 
					case 'text':
					case 'innertext':
					case 'innerhtml':
					case 'parentnode': 
					case 'label': 
					case 'domparent': 
					case 'parent': 
						this.mapPropertyToElement(e,i,v[i]);
					break;
					case 'onblur':
					case 'onchange':
					case 'onclick':
					case 'oncontextmenu':
					case 'ondblclick':
					case 'ondrag':
					case 'onfocus':
					case 'onkeydown':
					case 'onkeyup':
					case 'onkeypress':
					case 'onload':
					case 'onmousedown':
					case 'onmousemove':
					case 'onmouseout':
					case 'onmouseover':
					case 'onmouseup':
					case 'onresize':
					case 'onrightclick':
					case 'onscrol':
					case 'onselect':
					case 'onselectstart':
					case 'onunload':
						this.mapMethodToElement(e,i,v[i]);
					break;
					case 'background-attachment':
					case 'background-color':
					case 'border':
					case 'color':
					case 'display':
					case 'float':
					case 'font-size':
					case 'height':
					case 'imageurl':
					case 'left':
					case 'margin-botom':
					case 'margin-left':
					case 'margin-right':
					case 'margin-top':
					case 'margin':
					case 'overflow':
					case 'opacity':
					case 'padding':
					case 'padding-botom':
					case 'padding-left':
					case 'padding-right':
					case 'padding-top':
					case 'position':
					case 'right':
					case 'text-align':
					case 'top':
					case '-webkit-transform':
					case 'width':
					case 'z-index':
						this.mapStyleToElement(e,i,v[i]);
					break;
					default:
						if (i != 'element') {
							if (!(v[i] instanceof Function))
							this.mapAttributeToElement(e,i,v[i]);
						}
					break;
				}
		}
		return e;
	}	

	DomHelper.prototype.init = function init(){
		this.captureEvents={};
		this.capturerHandler=null;
		if (typeof(window.HTMLElement)=='undefined') {
			this.allfb='IE';
		}
		else 
			this.allfb='WK';
		this.sg = {
			fn:[document,'createElement',domHelper,'createElement']
		}
	}

	function DomHelper(){
		this.mouseData={};
		this.init();
	}

	return instance ? instance : instance = new DomHelper();
})()
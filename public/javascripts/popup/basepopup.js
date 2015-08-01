function SgBasePopup(){}

SgBasePopup.prototype.baseClass = 'SgControlContainer';


SgBasePopup.prototype.onFocus=function onFocus(e,o) {
	if (!o.sg) {
		o.sg={initted:true}
	}
	else {
		var highlight=+o.getAttribute('highlight');
		if (highlight==1)
			o.setAttribute('highlight',2);
		else
			o.setAttribute('highlight',1);
	}

}

SgBasePopup.prototype.onBlur=function onBlur(e,o) {
	if (o.getAttribute('active')=="1") {
		e.preventDefault();
		if (e.stopPropagation) 
			e.stopPropagation();
		e.cancelBubble=true;
		o.focus();
	}
}
				
SgBasePopup.prototype.onti=function onti(x,o) {
	timer=clearTimeout(timer);
	var o = document.getElementsByClassName('auto-hide-popup')[0];
	--x;
	if (x==0) { 
		o.children[0].children[1].innerHTML='by S.G.';
		o.setAttribute('oculto','1');
	}
	else {
		o.children[0].children[1].innerHTML=x;
		timer = setTimeout(function(){onti(x)},1000)
	 }
}
SgBasePopup.prototype.close=function close() {
	this.element.setAttribute('active',0);
	this.element.setAttribute('highlight','0');
//	this.element.setAttribute('oculto','1');
}

SgBasePopup.prototype.onKey=function onKey() {
	switch(arguments[0].keyCode) {
		case 27: // space -> start
		break;
		case 32:
			var popup = document.getElementsByClassName('auto-hide-popup')[0];
			var active = 1-(+popup.getAttribute('active'));
			popup.setAttribute('active',active);
			popup.setAttribute('highlight','0');
				popup.setAttribute('oculto','0');
			if (active) {
				popup.focus();
			}
			
			var x=10;
			timer = setTimeout(function(){
				onti(x);
				//popup.style.display='none';
			},1000)
		break;
			
	}
}

SgBasePopup.prototype.getControl = function getControl(k,o){
	if (k) {
		switch(k){
			case 'body': return this.controls[this.id+'_body']; break;
			case 'buttons': return this.controls[this.id+'_buttons']; break;
			case 'body_content': return this.controls[this.id+'_body_content']; break;
			case 'title':return this.controls[this.id+'_title']; break;
			case 'title_content':return this.controls[this.id+'_title_content']; break;
		}
	}		
	return SgBasePopup.prototype.base.getElement.call(this,k,o);
}

SgBasePopup.prototype.getElement = function getElement(k,o){
	if (k) {
		switch(k){
			case 'body': return this.controls[this.id+'_body'].element; break;
			case 'body_content': return this.controls[this.id+'_body_content'].element; break;
			case 'title':return this.controls[this.id+'_title'].element; break;
			case 'title_content':return this.controls[this.id+'_title_content'].element; break;
		}
	}		
	return SgBasePopup.prototype.base.getElement.call(this,k,o);
}


SgBasePopup.prototype.setContent = function setContent(){
	this.body = arguments[0];
}

SgBasePopup.prototype.show = function show(){
	var args ={};
	if (!arguments[1] || typeof(arguments[1])=='undefined') {
		args.body = arguments[0];
		args.title='NO TITLE'
	}
	else {
		if (!arguments[0]) {
			args.title='NO TITLE'
			args.body = 'NO BODY';
		}
		else {
			args.title=arguments[0];
			args.body = arguments[1];
		}
	}
	
	this.getControl('title_content').setContent(  args.title );
	this.getControl('body_content').setContent(  args.body);

	domHelper.mapToElement(this.element,{display:'block', active:1, oculto:0, highlight:0 })
	
	this.element.focus();
}

SgBasePopup.prototype.onCmdClick = function append(c){

	if (this.owner && this.owner.onCmdClick) {
		return this.owner.onCmdClick(arguments[0]);
	}
	if (this.handler && this.handler.onCmdClick) {
		return this.handler.onCmdClick(arguments[0]);
	}	
	
}

SgBasePopup.prototype.initControls = function initControls(){
	// contenedor de posicion relativa child de contenedor de posicion fixed
	// necesario para controlar el modelo de cajas
	var a = {
		id:this.id+'_',
		domParent:this.element,
		contentEditable:'false',
		className:'base-popup-container'
	}
	var c = new ISgControlContainer(a);
	this.controls[a.id]=c
	
	// barra de titulo del autohide
	var a = {
		id:c.id+'title',
		owner:c,
		contentEditable:'false',
		className:'base-popup-title'
		
	}
	this.controls[a.id]=new ISgControlContainer(a);

		var a = {
		owner:this.controls[a.id],
		id:c.id+'title_content',
		contentEditable:'false',
		className:'base-popup-title-content'
	}
	
	this.controls[a.id]=new ISgControlContainer(a);

	var a = {
		id:c.id+'command',
		owner:c,
		innerHTML:'X',
		contentEditable:'false',
		className:'base-popup-command',
		onmousedown:function(){
			popup.close(arguments[0],arguments[1],'false');
		}
	}
	this.controls[a.id]=new ISgControlContainer(a);
	
	// cuerpo del autohide
	var a = {
		id:c.id+'body',
		owner:c,
		contentEditable:'false',
		className:'base-popup-body'
	}
	var c =	new ISgControlContainer(a);		
	this.controls[a.id]=c;
	

	var a = {
		owner:c,
		id:c.id+'_content',
		contentEditable:'false',
		className:'base-popup-body-content'
	}
	this.controls[a.id]=new ISgControlContainer(a);			

	var a = {
		owner:c,
		contentEditable:'false',
		id:this.id+'_buttons',
		className:'base-popup-buttons'
	}
	this.controls[a.id]=new ISgControlContainer(a);			
	
}

SgBasePopup.prototype.init = function init(){
	var args = arguments[0] ? arguments[0] : {}
	args.className = domHelper.mergeClassName(args.className,'base-popup');
	args.active=0;
	args.domParent=document.body;
	
	args.onblur=popup.onBlur;
	args.onfocus=popup.onFocus;
	SgBasePopup.prototype.base.init.call(this,args);
	
	this.element.setAttribute('contentEditable','true');
}

function ISgBasePopup(){
	
	this.init(arguments[0]);
//	this.protoParent=ISgControl;
}

classHelper.register(SgBasePopup,ISgBasePopup);

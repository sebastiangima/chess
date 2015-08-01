function ISliderControl(){}
ISliderControl.prototype = new ISgControl()
ISliderControl.prototype.proto='ISgControl';


ISliderControl.prototype.onchange = function onchange(e,o,m) {
	var max = this.getElement('MAX');
	switch(m) {
		case 'min':
			var val = this.getElement('VAL');
			val.min=o.valueAsNumber;
		break;
		case 'max':
			var val = this.getElement('VAL');
			val.max = o.valueAsNumber;
		break;
	}
}
ISliderControl.prototype.mousemove = function mousemove(e,o,delta) {
	var thumb = this.getElement('THUMB');
	thumb.style.marginLeft = (+delta[1])+'px';
}
ISliderControl.prototype.mouseup = function mouseup(e,o) {
	//controller.cancelDelay();
	return true;

}
ISliderControl.prototype.mousedown = function mouseDown(e,o) {
//	this.mask.setAttribute('state',1);
//	this.element.setAttribute('state',1);
	this.rect = o.getClientRects()[0];
	this.mouseCoord = {y:e.clientY,x:e.clientX};
	flier.setHandler(['mouseup','mousemove'],this,this.mouseCoord);
}

ISliderControl.prototype.onThumbUp = function onThumbUp(e,o){
	return;
	if (e.type=='mouseout') {
		if(e.toElement!=this.element)
			return;
	}
	this.thumbState = false;
	this.mouse=null;
	var thumb=this.getControl('thumb');
	var mt=Number(thumb.element.style.marginLeft.replace('px',''));
	var ml=Number(thumb.element.style.marginTop.replace('px',''));
	var l=Number(thumb.element.style.left.replace('px',''))+this.deltaMouse[1]+mt;
	var t=Number(thumb.element.style.top.replace('px',''))+this.deltaMouse[0]+ml;
	this.lastDeltaMouse=[this.deltaMouse[0]+mt,this.deltamouse[1]+ml];
	domHelper.mapToElement(thumb.element,{'top':t+'px','left':l+'px','margin-top':'0px','margin-left':'0px'});
	
	this.count=0;
	this.deltaMouse=[0,0];
	this.mouse=[0,0];
	
	
}

ISliderControl.prototype.move = function move(coord){
	//output.setContent(this.boxsToHtml(),true);
	if (!this.moving) {
		this.moving=true;
	}
	else this.lastAction='dragged';

	this.updateStyles(this.lastAction);

	var top = coord.top;//-this.onDragData.top
	var left = coord.left;//-this.onDragData.left
	var marginTop = this.element.style.marginTop?+this.element.style.marginTop.replace('px',''):0;
	var marginLeft = this.element.style.marginLeft?+this.element.style.marginLeft.replace('px',''):0;
	
	this.element.style.marginLeft = +(this.boxs[this.lastAction].styles.margins.left.replace(regexcssval,''))+left+'px';
	this.element.style.marginTop = top+marginTop+'px';

}

ISliderControl.prototype.onThumbDown = function onThumbDown(e,o){
									var regexcssval=/[^0-9\.]/g;
									this.onSlideData = {
										origenDrag:{top:e.clientY, left:e.clientX},
										top: o.offsetTop,
										left: o.offsetLeft,
										stop: ('' || o.style.top).replace(regexcssval,''),
										sleft: ('' || o.style.left).replace(regexcssval,''),
										mleft: ('' || o.style.marginLeft).replace(regexcssval,''),
										mtop: ('' || o.style.marginTop).replace(regexcssval,'')
									}
											
											this.lastAction='slide'
											this.action='slide'
											this.startSlide(e,o);
											return false;

											

	this.count=0;
	this.mouse = [e.clientY,e.clientX];
	this.thumbState = true;
	//this.startSlide(
	
		// var t=this.getControl('thumb');
		// var b=this.getControl('bar');
		// var etl=[e.clientY,e.clientX];
		// var ttl=t.getTopLeft();
		// var btl=b.getTopLeft();
		// var ts=[t.element.clientTop,t.element.clientLeft];
		// var bs=[b.element.clientTop,b.element.clientLeft];
		// var to=[t.element.offsetTop,t.element.offsetLeft];
		// var bo=[b.element.offsetTop,b.element.offsetLeft];
	// var s='exy=['+etl.toString()+'\r\n';
	// s+='ttl=['+ttl.toString()+']   ts=['+ts.toString()+']    to=['+to.toString()+']\r\n';
	// s+='stl=['+ttl.toString()+']   ss=['+ts.toString()+']    so=['+to.toString()+']\r\n';
//	console.log(s)
	
}


ISliderControl.prototype.getElement = function getElement(e,o) {
	switch(e) {
		case 'THUMB': return this.element.querySelector('.slider-thumb');
		case 'MIN': return this.element.querySelector('.slider div.min > input');
		case 'MAX': return this.element.querySelector('.slider div.max > input');
		case 'VAL': return this.element.querySelector('.slider div.val > input');
	}
}

ISliderControl.prototype.initSlider = function initSlider() {
	if(!this.id)
		this.id='slider_'+guid;
	var a = {
		'guid':this.id,
		id:this.id,
		className:'slider-content',
		parentNode:this.element
	}
	
	var c = sgCreateNode('DIV',a);
	this.controls[a.id] = c;
	
	var this__=this;
	a = {
		id:c.id+'_'+'thumb',
		parentNode:c,
		className:'slider-thumb',
		onmousedown:function(){
			return this__.mousedown(arguments[0],arguments[1])
										},
		onmouseup:function(){
			return this__.mouseup(arguments[0],arguments[1])
		}
	}
	this.controls[a.id] = sgCreateNode('DIV',a);


	if (!this.value == 0) this.controls[a.id].style.marginLeft = '10px';
	else {
		this.controls[a.id].style.marginLeft = (this.controls[a.id].clientWidth-20)+'px';
	}
	
	a = {
		id:c.id+'_'+'bar',
		parentNode:c,
		className:'slider-bar'
	}
	this.controls[a.id] = sgCreateNode('DIV',a);
	
	
	var d = document.createElement('div');
	c.appendChild(d);
	d.className='label min';
	
	a = {
		id:c.id+'_'+'min',
		value:10,
		max:50,
		parentNode:d,
		type:'number',
		tagName:'input',
		className:'slider-value',
		onchange:function(){
			return this__.onchange(arguments[0],arguments[1],'min');
		}
	}
	
	this.controls[a.id] = sgCreateNode('input',a);

	var d = document.createElement('div');
	c.appendChild(d);
	d.className='label val';
	a = {
		id:c.id+'_'+'val',
		parentNode:d,
		max:100,
		min:0,
		type:'number',
		
		tagName:'input',
		className:'slider-value',
		onchange:function(){
			return this__.onchange(arguments[0],arguments[1],'val');
		}		
	}
	
	this.controls[a.id] = sgCreateNode('input',a);
	
	var d = document.createElement('div');
	d.className='label max';
	c.appendChild(d);
	a = {
		id:c.id+'_'+'max',
		value:100,
		max:100,
		parentNode:d,
		type:'number',
		tagName:'input',
		className:'slider-value',
		onchange:function(){
			return this__.onchange(arguments[0],arguments[1],'max');
		}		
	}
	
	this.controls[a.id] = sgCreateNode('input',a);
	
	// html +='<div id="app_1_appkaidanplex_slider_opacity" class="horizontal slider right" name="slider-opacity">';
	// html +='Opacidad ( % )';
	// html +=	'<div id="app_1_appkaidanplex_slider_opacity_slider" class="slider-content">';
	// html +=		'<div id="app_1_appkaidanplex_slider_opacity_slider_thumb" class="slider-thumb" style="margin-left: 199px;">';
	// html +=		'</div>';
	// html +=		'<div id="app_1_appkaidanplex_slider_opacity_slider_bar" class="slider-bar">';
	// html +=		'</div>';
	// html +=		'<div id="app_1_appkaidanplex_slider_opacity_slider_value" class="slider-value" tagname="input">100';
	// html +=		'</div>';
	// html +=	'</div>';
	// html +='</div>';
}
	
	
ISliderControl.prototype.init = function init() {
	var oargs = arguments[0].oargs || {},
			eargs = arguments[0].eargs || {},
			common = arguments[0].common || {};
		eargs.className += ' horizontal slider right';
		
		var this_=this;
		//common.guid = 'SLIDER_'+guid;
		common.id = 'SLIDER_'+guid;
		common.guid = 'SLIDER_'+guid;
		
		
		window[ISliderControl.prototype.proto].prototype.init.call(this,{},{
			'eargs':eargs,
			'oargs':oargs,
			'common':common
		})
	this.controls={};
	this.initSlider();
}


function SliderControl(){
	this.init(arguments[0]);
}

SliderControl.prototype = new ISliderControl();
var controller = (function () {
	var instance = null;
	
	Controller.prototype.timer=0;
	Controller.prototype.delay={
		event:null,
		target:null,
		listener:null
	}
	
	Controller.prototype.activate = function activate(o) {
		if (this.activeObject && (o.id && o.id!=this.activeObject.id || o.guid && o.guid==this.activeObject.guid)) {
			var handler=o;
			var inactivate=true;
			while (handler) {
				handler = (handler.handler && handler!=handler.handler) ? handler.handler : handler.owner ? handler.owner : null;
				if (handler && (handler.id && handler.id!=this.activeObject.id || handler.guid && handler.guid==this.activeObject.guid)) {
					inactivate=false;
					break;
				}
			}
			if (inactivate)
				this.activeObject.deactivate();
		}
		this.activeObject = o;
		o.setActive();
	}
	
	Controller.prototype.onDelayEvent = function onDelayEvent() {
		this.timer = clearTimeout(this.timer);
		if (!this.delay.event.sg) this.delay.event.sg = {};
		this.delay.event.sg.simulted = true;
		this.delay.target[this.delay.listener](this.delay.event,this.delay.target);
	
	}

	Controller.prototype.cancelDelay = function cancelDelay() {
		if (this.timer) {
			this.timer = clearTimeout(this.timer);
		}
	}
	
	Controller.prototype.delayEvent = function delayEvent(e,t,l,d) {
		if (this.timer) {
			this.timer = clearTimeout(this.timer);
			if (this.delay.event && this.delay.event.type=='mousedown') {
				var e = {
					clientX:this.delay.event.clientX,
					clientY:this.delay.event.clientY,
					ctrlKey:this.delay.event.ctrlKey,
					shiftKey:this.delay.event.shiftKey,
					altKey:this.delay.event.altKey,
					srcElement:this.delay.event.srcElement,
					target:this.delay.event.target,
					type:'dblclick'
				}
				//this.delay.target.ondblclick(e,this.delay.target)
			}
			return ;
		}
		this.delay.event = e;
		this.delay.target = t;
		this.delay.listener = l;
		if (typeof(d)=='undefined') d='0.3';
		this.timer = setTimeout('controller.onDelayEvent()',180);
		
	}
	

	
	function Controller(){
		this.prototypes={};
		this.klasses={};
		this.register_=function(){
			var kn=arguments[0], pk=arguments[1];
		}
	}
	
	return instance ? instance : instance = new Controller()
})()
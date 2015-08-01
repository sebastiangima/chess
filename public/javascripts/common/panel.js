function IPanel(){}
IPanel.prototype = new ISgControl()
IPanel.prototype.proto='ISgControl';

IPanel.prototype.init = function init(){
	var args ={
		eargs:{className:'panel'},
		oargs:{innited:true, ontop:false, controlFlier:true,handler:this},
		common:{}
		}
	
  var this_=this;
  args.eargs.onmouseup=function(){
    if (this_.ontop) {
      this_.element.style.zIndex=0;
    }
    else {
      this_.element.style.zIndex=99;
    }
    this_.ontop=!this_.ontop;
  }
	window[IPanel.prototype.proto].prototype.init.call(this,args,arguments[0]);
	
}

function Panel(){
	this.init(arguments[0]);
}
Panel.prototype = new IPanel();
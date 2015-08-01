	

var sgc=(function(){
	var instance=null;
	
	
	
	SgController.prototype.getActiveControl = function getActiveControl(ctxt) {
		if(ctxt) {
			var result=null;
			switch(ctxt) {
				case 'chess':
				
					if(chess.activeChess) 
						result = chess.chesses[chess.activeChess];
				break;
				case 'room':
					if(rooms.solapaActiva) 
						result = rooms.rooms[rooms.solapaActiva];
				break;
			}
		}
		return result;
	}
	
	SgController.prototype.find = function find(selector) {
	}
	SgController.prototype.findControl = function findControl(selector,type,parent,maxDeltaLevel,direction) {
		var r=this.getAllControls();
		for(var i in this.controls){
			if(this.controls[i].ctxt) {
				this.controls[this.controls[i].ctxt].childs.push(i)
				// this.controls[this.controls[i].ctxt].childs.push(this.controls[i].ctrl)
			}
			
		}
return this._findControl(selector,type,parent,maxDeltaLevel,direction) 
	
	}
	SgController.prototype.getSubTree_ = function getSubTree_(values) {
	}
	
	SgController.prototype.getSubTree = function getSubTree(values) {
		var v=[];
		var v0=values[0];
		while(values && values.length) {
			value=values.shift();
			if(v0!=value)
				v.push(value);
			values=values.concat(this.controls[value].childs)
		}
		return v
	}
	SgController.prototype.applyFilter = function applyFilter(type,value) {
		switch(type) {
			case 'internalGUID':
				for(var i=0; i<this.availables.length; ++i) {
					if(this.availables[i][0]==value) {
						var v = [this.availables[i][0],this.availables[i][1],this.availables[i][2]]
						delete this.availables.splice(this.availables.length);
						this.availables=[v];
					}
				}
			break;
			case 'level+':
			
					var index=-1;
				for(var i=0; i<this.availables.length; ++i) {
					if(this.availables[i][1]>=value) {
						index=i;
						break;
					}
				}
				if(index==-1) {
					
				}
				else if(index>=this.availables.length) {
					delete this.availables.splice(this.availables.length)
					break;
				}
				else {
					delete this.availables.splice(0,index)
				}
				
			break;
			case 'level-':
				var index=-1;
				for(var i=0; i<this.availables.length; ++i) {
					if(this.availables[i][1]>=value) {
						index=i;
						break;
					}
				}
				if(index==-1) {
					delete this.availables.splice(this.availables.length)
				}
				else if(index>=this.availables.length) {
					
					break;
				}
				else {
					delete this.availables.splice(index,this.availables.length-index)
				}
				
			break;
			case 'siblings':
				var p=this.controls[value].ctxt;
				for(var i=this.availables.length-1; i>=0; --i) {
					if(this.availables[i][0]==value || this.availables[i][2]!=p) {
						delete this.availables.splice(i,1)[0]
					}
				}
			break;
			case 'allsiblings':
				var p=this.controls[value].ctxt;
				for(var i=this.availables.length-1; i>=0; --i) {
					if(this.availables[i][2]!=p) {
						delete this.availables.splice(i,1)[0]
					}
				}
			break;
			case 'parents':
				var v=[];
				for(var i=this.availables.length-1; i>=0; --i) {
					if(this.availables[i][0]!=this.controls[value].ctxt) {
						delete this.availables.splice(i,1)[0]
					}
					else {
						value=this.availables[i][0];
					}
						
				}
				
			break;
			case 'descendents':
				var v=this.getSubTree([value])
					for(var i=this.availables.length-1; i>=0; --i) {
					if (v.indexOf(this.availables[i][0])==-1)
						delete this.availables.splice(i,1)[0]
				}			
			break;
			case 'childs':
				for(var i=this.availables.length-1; i>=0; --i) {
					if (!(this.controls[this.availables[i][0]].ctxt == value)) 
						delete this.availables.splice(i,1)[0]
				}
			break;
			case 'type':
				if(typeof (value)=='string' || value instanceof String) 
								value=window[value];
				for(var i=this.availables.length-1; i>=0; --i) {
					if (!(this.controls[this.availables[i][0]].ctrl instanceof value)) 
						delete this.availables.splice(i,1)[0]
				}
			break;
			case 'level':
				for(var i=this.availables.length-1; i>=0; --i) {
					if(!(this.availables[i][1]==value))
						delete this.availables.splice(i,1)[0]
				}
			break;
		}
	}
	
	SgController.prototype.applyFilters = function applyFilters(filters) {
		this.availables=[];
		for(var i in this.controls) {
			this.availables.push([i,this.controls[i].level,this.controls[i].ctxt])
		}
		this.availables = this.availables.sort(function(a,b){
			return a[1]>b[1] ? 1 : a[1]==b[1] ? 0 : -1;
		})
		for(var filter in filters) {
			if(!this.availables.length)
				return [];
			this.applyFilter(filter,filters[filter]);
			
		}

	}
	
	SgController.prototype._findControl = function _findControl(selector,type,parent,maxDeltaLevel,direction) {
	
		var filters={};
		if(parent===undefined && maxDeltaLevel===undefined && direction === undefined) {
			if(!selector || !selector.length || !(selector instanceof Array)) {
				selector = [selector]
			}
			type || (type = "internalGUID")
			for(var i=0; i<selector.length; ++i) {
				iResult=null;
				if (selector && selector[i] && selector[i].constructor && selector[i].constructor.name == 'Object') {
					for(var j in selector[i]) {
						filters[j]=selector[i][j]
					}
				}
				else {
					switch(type) {
						case 'descendents':
						case 'siblings':
						case 'childs':
						case 'type':
							filters[type]=selector[i];
						break;
						case 'level':
							filters[type]=selector[i];
						
						break;
						case 'internalGUID':
							if(this.controls[selector[i]]) {
								filters[type]=selector[i];
							}
						break;
					}
				}
			}
			this.applyFilters(filters);
		}
		else {
				
			if(!direction) {
			}
			else {
			}
		}
		var result=[];
		for(var i=0; i<this.availables.length; ++i) {
			result.push(this.controls[this.availables[i][0]])
		}
		return result;		
	}
	
	SgController.prototype.getArgumentClassType = function getArgumentClassType(o) {
		if(!o) {
			return 'null'
		}
		if(o instanceof ISgControl || o.internalGUID) {
			return 'ISgControl';
		}
		
		if(o.constructor) {
			switch(o.constructor.name) {
				case 'Array': return 'Array';
				case 'Object': return 'Object';
			}
		}
		return 'null';
	}
	

	SgController.prototype.addIfNotExists=function addIfNotExists(ctrl,ctxt) {
		if(ctrl && ctrl.internalGUID && !this.controls[ctrl.internalGUID]){
			var level = ctxt ? this.controls[ctxt].level+1 : 0;
			this.controls[ctrl.internalGUID]={ctrl:ctrl,ctxt:ctxt || null, level: level, childs:[]};
			return true;
		}
		return false;
	}
	SgController.prototype.getAllControls=function getAllControls(o,context) {
		if(o===undefined && !context) {
			this.controls={}
			o=rooms.rooms;
		}
		var result=[];
		switch(this.getArgumentClassType(o)){
				case 'ISgControl':
			
						
					
					if(this.addIfNotExists(o,context)) 
						result.push(o)
					
					else 
						break;
					
				case 'Object':
						for(var i in o) 
						result=result.concat(this.getAllControls(o[i],o.internalGUID || context));
					
				break;
				case 'Array':
						for(var i=0; i<o.length;++i) 
						result=result.concat(this.getAllControls(o[i],context));
					
				break;
		}
		return result;
	}
	
	
	
	function SgController(){
		this.controls={};
	}
	
	return instance ? instance : instance = new SgController();
})()
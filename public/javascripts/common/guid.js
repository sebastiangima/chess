	var guid = (function (){
		var instance = null;
		
		guid.prototype.randoms;
		guid.prototype.toString = function toString() {
			this.newone();
			return this.randoms[this.randoms.length-1].toString().replace('.','');
		}
		guid.prototype.newone = function newone(){
			var random = (Math.random(10) * 10).toString().replace(/[\.,]/g,'');
			this.randoms.push(random);
			this.indexs[random]=this.randoms.length-1;
			return this;
		}
		
		function guid(){
			this.randoms = []
			this.indexs = {}
			
		}
		
		
		return instance ? instance : new guid()
	})()
	
	

var sgscreen=(function(){
	var instance=null;
	
	SgScreen.prototype.makeLine = function makeLine(sl,name){
	var ches= chess.chesses[this.chessid];
	var coord0=ches.parseDestino(sl[0]);
	var coord1=ches.parseDestino(sl[1]);
	var sufijo=sl[2]===true?'_2':'';
	sufijo+=(sl[3]&&sl[3]=='tapado')?'t':'';
	var dx = coord1[1]-coord0[1];
	var dy = coord1[0]-coord0[0];
	
	var scale = Math.sqrt(dx*dx+dy*dy);
	var angle = Math.atan(dy/dx)*180/Math.PI;
	var rect=ches.getElement('RECT_CEL',coord0);
	var tx = Math.abs(dx)*25;
	var ty = Math.abs(dy)*25;
	//var tx = scale+25;
	
	
	var div = document.createElement('DIV');
	var img=document.createElement('IMG');
	div.appendChild(img);

	img.src='images/'+name+sufijo+'.png';
	div.className='fixedImage nosize';

	if (name=='line') {
		var img2 = document.createElement('img');
		img2.src='images/azul.png';
		img2.style.top = 50*(7-coord1[0])+'px';
		img2.style.left = 50*coord1[1]+'px';
		img2.className='fixedImage';
		
	}
	
	if (dx>0 && dy>0) {
		angle += 90;
		ty=(7-coord0[0])*50-(coord1[0]-coord0[0])*25;
		tx=coord0[1]*50-(coord0[1]-coord1[1])*25;
	}
	else if (dx>0 && dy<0) {
		angle = -90+angle;
		tx=tx+100;
		tx=0;
		ty=0;
		
		ty=(7-coord0[0])*50-(coord1[0]-coord0[0])*25;
		tx=coord0[1]*50-(coord0[1]-coord1[1])*25;;
		
	}

	else if (dx<0 && dy<0) {
		angle = -90+angle;
		// tx=tx+100;
		// ty=ty+100;
		ty=(7-coord0[0])*50-(coord1[0]-coord0[0])*25;
		tx=coord0[1]*50-(coord0[1]-coord1[1])*25;
	}	
	else if (dx<0 && dy>0){
		ty=(7-coord0[0])*50-(coord1[0]-coord0[0])*25;
		tx=coord0[1]*50-(coord0[1]-coord1[1])*25;
		angle=90+angle;
	}
	else if (dx==0) {
		ty=(7-coord0[0])*50-(coord1[0]-coord0[0])*25;
		tx=coord0[1]*50;
	}
	else if (dy==0) {
		ty=(7-coord0[0])*50-(coord1[0]-coord0[0])*25;
		tx=coord0[1]*50-(coord0[1]-coord1[1])*25;;
		if (dx>0)
			angle=180;
				
	}
	img.style['-webkit-transform']='rotateZ('+angle+'deg) scaleX('+scale+')';
	// div.style.top = ty+rect.top+'px';
	// div.style.left = tx+rect.left+'px';
	div.style.top = ty+'px';
	div.style.left = tx+'px';

	if (img2) 
		return [div,img2];
	else
		return div;
	
}

	SgScreen.prototype.makeFlecha = function makeFlecha(fl){
		var ches= chess.chesses[this.chessid];
		var coord0 = ches.parseDestino(fl[0]);
		var coord1 = ches.parseDestino(fl[1]);
		var dy=coord1[0]-coord0[0];
		var dx=coord1[1]-coord0[1];
		var div = document.createElement('DIV');
		var img=document.createElement('IMG');
		div.appendChild(img);
		div.className='fixedImage nosize';
		var delta=[0,0];
		switch(dy+dx*10) {
			case -19: img.src='images/flecha2.png'; delta=[-1,-2];break;
			case -8: 		img.src='images/flecha6.png'; delta=[-2,-1];break;
			case 12:	img.src='images/flecha3.png'; delta=[-2,0];break;
			case 21:	
			img.src='images/flecha7.png'; delta=[-1,0];break;
			case -21:	img.src='images/flecha5.png'; delta=[0,-2]; break;
			case 8:				img.src='images/flecha4.png'; delta=[0,0];break;
			case -12:	img.src='images/flecha1.png'; delta=[0,-1]; break;
			case 19:		img.src='images/flecha8.png'; delta=[0,0];break;
			
		}
		//console.log(dy+dx*10);
		 div.style.top=(50*(7-coord0[0]+delta[0]))+'px'
		 div.style.left=(50*(coord0[1]+delta[1]))+'px'
		return div;
		
	}

	SgScreen.prototype.zIndex = function zIndex(z){
    var div=document.getElementById('last');
    if (!div) return;
    var v=Array.prototype.slice.call(div.querySelectorAll('div.nosize'),0);
    v.map(function(){
      arguments[0].style.zIndex=z;
    })
    
  }
  
	SgScreen.prototype.setExtra = function setExtra(extra,i0,j0,noclean){
		if (!this.chessid) this.chessid = chess.activeChess;
		if (typeof(i0)=='undefined') i0=0;
		if (typeof(j0)=='undefined') j0=0;

		if (extra) {
			this.extras=extra;
		}
		else {
			this.extras = 
				[
					[
						{
							cruz: ['d4']
						}
					]
				]
		}
		this.showExtra(i0,j0,noclean);
	}
	
	SgScreen.prototype.showExtra = function showExtra(i0,j0,noclean){
		var text=0;//this.getElement('TEXTO');
		if (!text) {
			
			//text = sgCreateNode(args);
		}
		var div=document.getElementById('last');
		var ches= chess.chesses[this.chessid];
		if (!div) {
			div = document.createElement('div');
			ches.element.appendChild(div);
			div.className='extras';
			div.id='last';
		}
		if (!noclean)
			this.clean();
		if (this.extras[i0] && this.extras[i0][j0]) {
			var cel, coord,coord1, elem, rect, rect1, width, height, a;
			for (var i in this.extras[i0][j0]) {
				switch (i) {
					case 'texto':
						break;
						var d = document.createElement('DIV');
						d.innerHTML = '<div>'+this.extras[i0][j0][i].join('<br />').replace(/sph__/g,'<span class="head">').replace(/spp__/g,'<span class="spp">').replace(/spx__/g,'<span class="porque">').replace(/spn__/g,'<span class="neg">').replace(/__sp/g,'</span>').replace(/sp__/g,'<span>')+'</div>';
						text.appendChild(d.children[0]);
						text.children[text.children.length-1].scrollIntoView()
						
					break;
					case 'cruz':
						for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
							cel = this.extras[i0][j0][i][j];
							coord=ches.parseDestino(cel);
							rect=ches.getElement('RECT_CEL',coord);
							var img=document.createElement('IMG');
							img.src='images/cruz.png';
							img.className='fixedImage';
							 // img.style.top=Math.abs(9-coord[0])*30+'px'
							 // img.style.left=Math.abs(coord[1])*25*+'px'
							 img.style.top=(50*(7-coord[0]))+'px'
							 img.style.left=(50*coord[1])+'px'
							 img.style.width='50px'
							 img.style.height='50px'
							 
							// rect.top+'px';
							// img.style.left=rect.left+'px';
							// img.style.right=rect.right+'px';
							// img.style.bottom=rect.bottom+'px';
							div.appendChild(img);
						}
					break;
					case 'line':
						for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
							var r = this.makeLine(this.extras[i0][j0][i][j],'line');
							for (var k=0; k<r.length; ++k) 
								div.appendChild(r[k]);
						}
						break;
					case 'flecha':
						for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
							div.appendChild(this.makeFlecha(this.extras[i0][j0][i][j]));
						}
						break;
					case 'sline':
						for (var j=0; j<this.extras[i0][j0][i].length; ++j) {
							div.appendChild(this.makeLine(this.extras[i0][j0][i][j],'sline'));
						}
						break;
					
				}
			}
		
		}
		
	}

	SgScreen.prototype.clean = function clean(){
		var div=document.getElementById('last');
		if (div) {
			while(div.children.length) {
				div.removeChild(div.children[0]);
			}
		}
	}

	
	
	
	function SgScreen(){}
	
	return instance ? instance : instance = new SgScreen();
})()
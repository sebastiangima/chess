var runmacro=true;
var macroTimer  = 0;

function macro(n, r, o) {
	if (macroTimer) macroTimer = clearTimeout(macroTimer);
	if (!runmacro) return;
	switch(n) {
		case 1:	rooms.getElement('LISTENER','ENTRENAR').click(); break;
		case 2:	rooms.rooms[r].aperturas();
			rooms.rooms[r].element.querySelector('li#DSVDN').click();
			macroTimer = setTimeout('macro(3,"RIGHT")',500);
		break;
		case 3: sendKey(r); break;
		case 4: 
			var btn= document.body.querySelectorAll('button');
			for (var i=0; i<btn.length; ++i)
				if (btn[i].innerHTML=='ENTRENAR') {
					btn[i].click();
					
				}
					
		break;
		case 5:
			if (!chess.activeChess || !chess.chesses[chess.activeChess]) {
				macroTimer = setTimeout('macro(5)',1000);
				return;
			}
			analizer.init(chess.chesses[chess.activeChess].roomid,chess.chesses[chess.activeChess].chessid);
			macroTimer = setTimeout('macro(6)',1000);
			//analizer.show();
		break;
		case 6:
			analizer.analize();
		break;
		case 10: 
			var btn= document.body.querySelectorAll('button');
			for (var i=0; i<btn.length; ++i)
				if (btn[i].innerHTML=='ENTRENAR') {
					btn[i].click();
					
				}
					
		break;	
		case 40:
			
		
		break;		
		case 41:
			macroTimer = setTimeout('macro(42,"LEFT")',1);
		break;
		case 42:
			rooms.createGlobalRoom(null,function(){
				macro(43,rooms.groom)
			})
		break;
		case 43:
			socket.emit('macroBroadcast',[44,r])
		break;
		case 44:
			var args={parentNode:{children:[{innerHTML:r}]},color:'BLANCAS'}
			rooms.unirFromList(null,args,manageSessions.get('login'))
		break;

	}
}



function sgCreateNode(tagName, properties){
	if (!tagName) tagName = 'DIV'
	var d = document.createElement(tagName);
	
	return domHelper.mapToElement(d,properties);
	for (var i in properties) {
		switch (i) {
			case 'onclick':
			case 'onmouseup':
			case 'onmousedown':
				d.onmousedown = properties[i];
			break;
			case 'className':
				properties[i]=properties[i].replace(/undefined/g,'').trim();
			case 'innerHTML':
			case 'name':
			case 'id':
				d[i] = properties[i];
			break;
			case 'parentNode':
				properties[i].appendChild(d);
			break;
			case 'pcolor':
			case 'fila':
			case 'orientacion':
			case 'columna':
			case 'state':
				d.setAttribute(i,properties[i]);
			break;
			case 'display': 
			case 'top': 
			case 'left':
				d.style[i]=properties[i];
			break;
			case 'src':
				var img = sgCreateNode('IMG',{parentNode:d});
				img.src = properties[i];
			
			break;
		}
	}
	return d;
}


/*	Extrae de una cadena de texto, el valor numérico de la misma,
	Originalmente, orientada a obtener el dato numérico cargado en 
	un estilo css, como por ejemplo: top:10px. */
function getNumericValue(s) {
	var result = s ? s : '';
	if (typeof(result)=='undefined' || result===null)
		return 0;
	result = result.replace(regexcssval,'');
	if (result == '')
		return 0;
	return +result;
}

function toogle2(event,node,attr) {
	var v = node.getAttribute(attr);
	if (typeof(v)=='undefined')
		v = 0;
	node.setAttribute(attr,1-v);
	if (event.stopPropagation) event.stopPropagation();
	event.cancelBubble=true;
	return true;

}

function toogle(e,a) {
	var v = e.getAttribute(a);
	if (typeof(v)=='undefined')
		v = 0;
	e.setAttribute(a,1-v);
	if (e.stopPropagation) e.stopPropagation();
	e.cancelBubble=true;
	return true;
}

function toogleto(e,a,v){
	e.setAttribute(a,v)
}


function sendKey(k, target, alt, ctrl, shft) {
	var e = {altKey:alt || false, ctrlKey: ctrl || false, shiftKey: shft|| false,
		preventDefault:function(){}, stopPropagation:function(){}, cancelBubble:true, x:0, y: 0, 'targat':target|| null};
	switch(k) {
		case 'RIGHT': e.keyCode=39; break;
	}
	chess.keyDown(e);
}

function cancelEvent(e) {
	if (e && e.preventDefault) e.preventDefault();
	if (e && e.stopPropagation) e.stopPropagation();
	if (e) e.cancelBubbles=true;
	return false;
}


function stopEvent(e) {
	if (e.stopPropagation)
		e.stopPropagation();
	e.cancelBubble = true;
	return false;
}

String.prototype.padLeft = function padLeft(length,pad) {
	return this.getPad(length,pad)+this;
}

String.prototype.getPad = function getPad(length,pad) {
	if (!pad) pad = ' ';
	var pre='';
	for (var i=this.length; i<length; ++i) {
		pre+=pad;
	}
	return pre;
}

String.prototype.padRight = function padRight(length,pad) {
	return this+this.getPad(length,pad);
}

// Object.prototype.sgclone = function sgclone() {
	// return Array.prototype.slice.call(this,0);
// }

Array.prototype.clone = function clone() {
	return Array.prototype.slice.call(this,0);
}


// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

var partidas = {
	'Kramnik-Kasparov':{
		resultado:'0 - 1',
		descripcion:'sacrificio de dama',
		jugadas:[['d4','Cf6'],['c4','g6'],['Cc3','Ag7'],['e4','d6'],['Cf3','O-O'],['Ae2','e5'],['d5','a5'],['Ag5','h6'],['Ah4','Ca6'],['O-O','Ad7'],['Cd2','Cc5'],['b3','Cfxe4'],['Axd8','Cxc3'],['De1','Tfxd8'],['Tc1','Cxa2'],['Ta1','Cb4'],['Ad1','e4'],['Tb1','Te8'],['De3','f5'],['h4','Tf8'],['g3','Tae8'],['Rg2','Cbd3'],['Tg1','f4'],['gxf4','Txf4'],['h5','g5'],['Tf1','Th4'],['Th1','Tf4'],['Tf1','Tef8'],['f3','Th4'],['fxe4','Cf4+'],['Rg1','Ccd3'],['e5','Cxe5'],['Tc1','Th3'],['Cf3','g4'],['Cxe5','Txe3'],['Cxd7','Ch3+'],['Rg2','Txf1'],['Rxf1','g3'],['Rg2','Cf4+']]
	},
	'Kasparov-Topalov':{	
		resultado:'1 - 0',
		descripcion:'sacrifica todo',
		jugadas:[['e4','d6'],['d4','Cf6'],['Cc3','g6'],['Ae3','Ag7'],['Dd2','c6'],['f3','b5'],['Cge2','Cbd7'],['Ah6','Axh6'],['Dxh6','Ab7'],['a3','e5'],['O-O-O','De7'],['Rb1','a6'],['Cc1','O-O-O'],['Cb3','exd4'],['Txd4','c5'],['Td1','Cb6'],['g3','Rb8'],['Ca5','Aa8'],['Ah3','d5'],['Df4','Ra7'],['The1','d4'],['Cd5','Cbxd5'],['exd5','Dd6'],['Txd4','cxd4'],['Te7','Rb6'],['Dxd4','Rxa5'],['b4','Ra4'],['Dc3','Dxd5'],['Ta7','Ab7'],['Txb7','Dc4'],['Dxf6','Rxa3'],['Dxa6','Rxb4'],['c3','Rxc3'],['Da1','Rd2'],['Db2','Rd1'],['Af1','Td2'],['Td7','Txd7'],['Axc4','bxc4'],['Dxh8','Td3'],['Da8','c3'],['Da4','Re1'],['f4','f5'],['Rc1','Td2'],['Da7',null]]
	}
}
var raiz='';
// var raices={nap:[],bap:[]};
// bap['RuyMoeller-SteinDef'].sort();
// nap['RuyMoeller-SteinDef'].sort();

function proc(n,from,fromi) {
	
	var max=v[n].length<v[n+1].length?v[n].length:v[n+1].length;
	
	var cortar=false;
	for (var i=0; i<max; ++i) {
		if (v[n][i]!=v[n+1][i]) {
			cortar=true;
		}
		if (cortar) {
			if (v[n][i]==' ') {
				raiz=v[n].substr(0,i);
				raiz=raiz.replace(/ [^ ]*$/,'');
				break;
				cortar=false;
			}
			
		}
	}	
	var games=[];
	for (var i=n; i<v.length; ++i) {
		if (v[i].indexOf(raiz)==0)
			games.push(i);
	}
	raices[from].push({'raiz':raiz, 'fromi':fromi,'games':games});
	return games.length;
}
var v=[];
function procv(name) {
	var n=0;
	v=bap[name];
	while(n<v.length-1) {
		n+=proc(n,'bap',name);
	}
	n=0;
	v=nap[name];
	while(n<v.length-1) {
		n+=proc(n,'nap',name);
	}
	
}
//procv('RuyMoeller-SteinDef');
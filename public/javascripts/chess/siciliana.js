function IDefensaSiciliana(){}
IDefensaSiciliana.prototype = new IApertura()
IDefensaSiciliana.prototype.proto='IApertura';

IDefensaSiciliana.prototype.selectVDN = function selectVDN(){
	this.jugadas = [
		['e4','c5'],['Cf3','d6'],['d4','cxd4'],['Cxd4','Cf6'],['Cc3','g6'],['Ae3','Ag7'],
	]
	this.extras = [
		[
		{texto: ['sph__1.  e4 ...__spspp__Apertura, juegan las blancas, una salida natural, que introduce un peón en una de las </span><span class="link" value="casilla-central">casillas centrales</span>']},
		{
		texto: ['sph__1.  e4 c5__spspp__Al jugar spn__c5__sp en respuesta a spn__e4__sp, las negras plantean la defensa siciliana, la cual propone atacar el centro del tablero con un peón lateral, de esta manera, si las blancas deseasen recuperar la casilla d4, estaran forzadas a cambiar el peón central de dama__sp',
			'spp__Si las blancas aceptan el cambio de peones, practicamente, las negras dispondrán solo del enroque rey, esto no supone una desventaja, ya que a cambio de ello, se tendrá un fuerte ataque al flanco dama, y la apertura de la columna del alfil de dama, será aprovechada por las torres rápidamente__sp'
		],
		cruz:['d4']}],	
		[
			{
			texto: [
				'sph__2.  Cf3 ...__spspp__Es entonces el plan de las blancas luchar por el centro, para lo cual, desarrolla su caballo rey, preparando la posterior ruptura en spn__d4__sp__sp',
				'spp__Es importante contar con el apoyo del caballo para realizar el cambio de peones, de lo contrario, se estaría obligado a tomar con dama, situación que resulta poco conveniente. spx__¿Por qué?__sp__sp',
				'spp__Ciertamente, podría apoyarse al peón dama con el peón del alfil del mismo flanco, pero ello, requeriría un total de 4 movimientos desde el inicio, en los cuales, solo se movieron peones, lo que ocasionará un retraso en el desarrollo posicional, y aunque se ocupan ambas casillas centrales con nuestros peones, éstos quedan separados y alejados de los demás, volviéndolos un tanto vulnerables__sp'
			],
			flecha:[['f3','d4'],['f3','e5']]},
			{
			texto:[	'sph__2.  Cf3 d6__spspp__En este momento, las negras podrían haber jugado distinto, dando origen a las diversas líneas de la defensa siciliana, por ejemplo:__sp',
				'spp__spp__2 ... spn__Cc6, o Cf6 o Da5 o DC7 o g6 o a6. Siendo la primera de ellas la línea principal__sp__sp__sp',
				'En este caso se tratará la variante del dragón normal, y se verán cosas también de la variante del dragón ascelerado, y sus problemáticas',
				'spp__La jugada de spn__d6__sp tiene varias finalidades, por un lado, ofrece soporte al molesto peóón de spn__c5__sp y además libera la prisión del alfil blanco posibilitando un ágil desarrollo de éste, de ser ello, necesario, finalmente, también inpide el avance por spn__e5__sp tanto al peón como al caballo__sp'
				],
			line:[['d6','c5']],sline:[['c8','h3']],cruz:['e5']}
		],
		[
		{texto: [
			'sph__3. d4 ...__spspp__Ahora sí, se procede con la ruptura en la columna de la dama, planteando la posibilidad del cambio, es para las blancas, la casilla spn__d4__sp, fundamental para su libre movimiento, por ello, acepta el cambio del peón central por el lateral, por otro lado, toma poseción completa del centro, con un caballo adelantado y ambos alfiles destapados que posibilitará un rápido desarrollo de sus piezas menores__sp'
		],
		sline:[['c1','h6'],['f1','a6']],
		cruz:['d5','f5']
		},
		{texto: [
			'sph__3. d4 cxd4_spspp__Es necesario aceptar el cambio, nos quitará el peón dama de dicho columna, o bien forzará un prepaturo desarrollo de la dama__sp',
			'de hecho, es el cambio, lo que se buscaba.'
		
		]
		}
		],
		[{
			texto: [
				'sph__4.  Cxd4 ...__spspp__Se recupera el peón cambiado, alcanzado un pocisionamiento ágil, tanto para los alfiles, caballos, y enroques__sp',
			]
		},
		{
			texto:[
				'sph__4.  Cxd4 Cf6__spspp__Es necesario que se juega spn__4. ... Cf6__sp, específicamente, sin demorarlo, la idea es impedir que el blanco realice el nudo Maroczy spq__¿Qué?__sp, que se logra con dos peones, uno en spn__e4__sp y otro en spn__c4sp, de manera que se obtiene el control total de la casilla spn__d5__sp y además confiere a las blancas de buen espacio para movilizarse.__sp',
				'Es con el caballo que se evita la configuración Marocsy, ya que al amenazar tomar al peón de spn__e4__sp, obliga a su protección, que se llevará a cabo, por el caballo dama, bloqueando el adelantamieno del peón de spn__c2__sp.',
				'spp__Si bien se cuenta con Ad3 o f3 o Dc3 o Df3 como alternativas para proteger al peón rey, todas éstas traen inmediatos inconvenientes__sp',
				'spp__Los movimientos de dama a las casillas blancas que defienden spn__e4__sp entorpecen al desarrollo del alfil blanco y ocupan casillas de retorno para ambos caballos, además queda la dama, expuesta a amenazas tanto desde spn__e5__sp, tras la navegación de alguno de los caballos negros hasta dicho lugar, así como también puede ser tocada con el alfil blanco, al tiempo que éste se desarrolla a la buena casilla para él spn__g4__sp forzando al blanco a retirar su dama o interceptar con peón o caballo, en todos los casos, ocacionando una pérdida de tiempo__sp',
				'spp__Protegiendo con spn__Ad3__sp se perderá un tiempo, ya que el caballo en d4 que suelto, y es facil de expulsar con spn__e5__sp por ejemplo, lo que provoca el amontonamiento de piezas blancas en el flanco dama. Volver a spn__f6__sp, evidenciaría la perdida de tiempo con el caballo, y no es opción Cf6, ya que la jugada g6 será la jugada próxima en la defensa del dragón, la cual, forzaría un nuevo movimiento del caballo blanco, al ser tocado desde g6, mientras se habre el hueco para desarrollas al alfil negro por la diagonal fiancheto__sp',
				'Spp__Es por ello que moviendo al caballo, tocando al peón central de las blancas, se previene la formación Maroczy__sp'
				
			],
			flecha:[['f6','e4']]
		}
		],
		[
			{
				flecha:[['c3','e4']]
			},
			{
			}
		]
			
	]
}

IDefensaSiciliana.prototype.initPanel = function initPanel(){

	switch (this.tipo) {
		case 'VDN': this.selectVDN(); break;
	}	
	window[IDefensaSiciliana.prototype.proto].prototype.initPanel.call(this);
}

IDefensaSiciliana.prototype.init = function init(){
	var common={
				name: 'Defensa Siciliana',
			},
			eargs={
				parentNode:arguments[0].parentNode
			},
			oargs={
				tipo: arguments[0].tipo,
				roomid: arguments[0].roomid,
				chessid: arguments[0].chessid
				
			};
		window[IDefensaSiciliana.prototype.proto].prototype.init.call(this,{'commom':common,'eargs':eargs,'oargs':oargs},{
			eargs:{display:'block', name:'siciliana', className: 'apertura'},
			oargs:{}
		})
	this.initPanel();
}

function DefensaSiciliana(){
	this.init(arguments[0]);
}

DefensaSiciliana.prototype = new IDefensaSiciliana();
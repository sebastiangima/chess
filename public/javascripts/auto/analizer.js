
var analizer = (function(){

	var instance = null;


	Analizer.prototype.clean= function clean(){
		var d = document.querySelectorAll('.sobrecel');
		for (var i in d) {
			d[i].parentNode.removeChild(d[i]);
			delete d[i];
		}
	}

	Analizer.prototype.zIndex=function zIndex(z) {
    sgscreen.zIndex(z);
  }
	Analizer.prototype.showAllAtacados=function showAllAtacados(jugador) {
		return;
    var rival;
    this.analize();
		if (jugador=='blanco') rival='negro';
		else rival='blanco';
		var at, toMark=[];
		this.clear();
		sgscreen.clean();
		this.extras=null;
//		this.pintados=[];
    var index=0;
		for (var i in this.ches[rival].atacados) {
			ataque = this.ches[rival].atacados[i];
			at = []
			for (var j=0; j<ataque.length; ++j) {
				if (ataque[j][4]=='libre') {
					at.push(ataque[j]);
				}
				else {
					at.push(ataque[j]);
					
				}
			}
			var def=[], ata=[], rat=[];
			if (at.length) {
				var e = this.ches[rival].getPiezaByGUID(this.indexs[at[0][5]]);
				// domHelper.addClass(e.element,'luz');
				// domHelper.mapToElement(e.element,{'roja':1});
				// this.pintados.push(e.element);
				def=this.getDefensores(e,true);
				ata=this.getAtacantes(e,true);
			}
      if (ata.length) {
        for (var l=0; l<at.length; ++l) {
          for (var ll=0; ll<ata.length; ++ll) {
            if (ata[ll].internalGUID==at[l][0])
              rat.push(at[l]);
          }
        }
       if (!this.ches[jugador].atacando)
        this.ches[jugador].atacando={}
       if (!this.ches[jugador].atacando[i])
        this.ches[jugador].atacando[i]=[];
        this.ches[jugador].atacando[i].push(rat)
       
        
      }
			if (def.length<ata.length) {
				this.showDefensores(e,true);
				this.showAtacantes(e,true);
				domHelper.addClass(e.element,'luz');
				domHelper.mapToElement(e.element,{'roja':1});
				this.pintados.push(e.element);
			}
			
		}
    
		analizer.zIndex(8);

	}
	// ctxt: contexto, con el cual se definirá las propiedades a controlar
	Analizer.prototype.showDefensores= function showDefensores(p,noclean){
		
	
	 var defensores = this.getDefensores(p);
    if (!this.pintados) this.pintados=[];
		var s='';
		if (!this.extras) {
			this.extras=[[
			]];
		}
		var oo = {
			sline:[], 
			cruz:[], 
			flecha:[]
		}
		var tobj='';
    for (var i=0; i<defensores.length; ++i) {
      if (defensores[i] && defensores[i].element) {
				switch (defensores[i].name){
					case 'peon':
						tobj='sline';
					break;
					case 'alfil':
						tobj='sline';
					break;
					case 'reina':
						tobj='sline';
					break;
					case 'caballo':
						tobj='flecha';
					break;
					case 'torre':
						tobj='sline';
					case 'rey':
						tobj='sline';
					break;
				}
				oo[tobj].push([this.ches.getCasillatNotation([defensores[i].row,defensores[i].col]), 
					this.ches.getCasillatNotation([p.row,p.col])]);
					// domHelper.addClass(defensores[i].element,'luz');
					// domHelper.mapToElement(defensores[i].element,{'roja':0});
					// this.pintados.push(defensores[i].element);
      }
    }
		// var extras={};
		// if (oo.sline.length)
			// extras.sline=sline;
		// if (oo.flecha.length)
			// extras.flecha=flecha;
		// if (oo.cruz.length)
			// extras.cruz=cruz;
		this.extras=[[oo]]
    return defensores;
  }

	Analizer.prototype.showAtacantes= function showAtacantes(p,noclean){
    var atacantes = this.getAtacantes(p);
    
		var tobj='';
    for (var i=0; i<atacantes.length; ++i) {
      if (atacantes[i] && atacantes[i].element) {
				switch (atacantes[i].name){
					case 'peon':
						tobj='sline';
					break;
					case 'alfil':
						tobj='sline';
					break;
					case 'reina':
						tobj='sline';
					break;
					case 'caballo':
						tobj='flecha';
					break;
					case 'torre':
						tobj='sline';
					case 'rey':
						tobj='sline';
					break;
				}
				this.extras[0][0][tobj].push([this.ches.getCasillatNotation([atacantes[i].row,atacantes[i].col]), 
					this.ches.getCasillatNotation([p.row,p.col]),	,atacantes[i].tipo]);
					// domHelper.addClass(atacantes[i].element,'luz');
					// domHelper.mapToElement(atacantes[i].element,{'roja':1,'tipo':atacantes[i].tipo});
					// this.pintados.push(atacantes[i].element);
      }
    }

		sgscreen.setExtra(this.extras,0,0,noclean);   
    return atacantes;
  }

  Analizer.prototype.show=function show(p) {
		// var jugador = this.ches[(p.color=='blancas')?'blanco':'negro'];
		// this.ches[jugador].piezas.bishop[0].pieza.getCells();
		// return;
			
		this.showAtacantes(p,this.showDefensores(p));
	}

	Analizer.prototype.getDefensores= function getDefensores(p){
		var jugador = this.ches[(p.color=='blancas')?'blanco':'negro'];
    var defendido = jugador.defendidos[p.internalGUID];
    var defensores = []
    if (defendido) {
      for (var i=0; i<defendido.length;++i) {
				pp=jugador.getPiezaByValueAndGUID(defendido[i][0],defendido[i][3])
				if (defendido[i][4]=='tapado') {
					if (!this.esAtaqueTapado(p,pp,true))
						continue;
				}
				defensores.push(jugador.getPiezaByValueAndGUID(defendido[i][0],defendido[i][3]))
      }
    }
    return defensores;
  }

	Analizer.prototype.esAtaqueTapado= function esAtaqueTapado(p,pp,defensa){
		
		var dcol=0, drow=0;
		if (pp.name=='caballo') {
			return false;
		}
		dcol = (p.col==pp.col)?0:(p.col>pp.col) ?1 :-1;
		drow = (p.row==pp.row)?0:(p.row>pp.row) ?1 :-1;
		
		var r,c,m,posible;
		var action = defensa ? 'defensa' : 'ataque';
		r=pp.row;
		c=pp.col;
		var tipos=['tapado','libre']
		while(1) {
			r+=drow;
			c+=dcol;
			if (r<0 || r>7 || c<0 || c>7)
				break;
			if (r==p.row && c==p.col)
				break;
			m=this.ches.matriz[r][c];
			if (m==='') {}
			else {
				if (m*pp.value<0 && !defensa || defensa && m+pp>0)
					return false;
				else {
					var ppp=pp.handler.getPiezaByValueAndGUID(this.indexs[r*8+c],m);
					posible = false;
					for (var t=0; t<2; ++t) {
						for (var k=0; k<ppp.movs[tipos[t]][action].length; ++k) {
							if (ppp.movs[tipos[t]][action][k].row==p.row && ppp.movs[tipos[t]][action][k].col==p.col) {
								posible=true;
								break;
							}
						}
					}
					if (!posible)
						return false;
				}
			}
		}
		return true;
		return true;
	}
	
	
	Analizer.prototype.getAtacantes= function getAtacantes(p){
    var jugador = this.ches[(p.color!='blancas')?'blanco':'negro'];
    var atacado = p.handler.atacados[p.internalGUID];
    var atacantes = []
    if (atacado) {
      for (var i=0; i<atacado.length;++i) {
				pp=jugador.getPiezaByValueAndGUID(atacado[i][0],atacado[i][3],atacado[i][4])
				if (atacado[i][4]=='tapado') {
					if (!this.esAtaqueTapado(p,pp))
						continue;
				}
        atacantes.push(pp);
      }
    }
    return atacantes;
  }
  
	Analizer.prototype.clear= function clear(){
    if (this.pintados && this.pintados.length) {
      for (var i=0; i<this.pintados.length; ++i) {
        domHelper.removeClass(this.pintados[i],'luz');
      }
      return true;
    }
		sgscreen.clean();
  }
  
	Analizer.prototype.getInfo= function getInfo(ctxt,args){
		var x = this, xi=null;
		if (!args.pnames) args.pnames=[];
		args.pnames.push('internalGUID');
    return '';
		switch(ctxt) {
			case 'TOCADO':
				x=x.matriz[args.row][args.col].tocado;
				xi=[];
				for (var i in x) {
					for (var j=0; j<x[i].length; ++j) {
						xi.push(this.infos[x[i][j]]);
					}
				}
				//args.pnames.push([
				//args.pnames.push('internalGUID');
				
			break;
		}
		var result =  {blancas:[],negras:[]};
			if (xi) {
				for (var i=0; i<xi.length; ++i) {
					result[xi[i].color].push(xi[i]);
				}
			}
	
		return result;
	}
	
	Analizer.prototype.analizeTorre= function analizeTorre(p){
    var vd = [[1,0],[0,1],[-1,0],[0,-1]];
    var dir = [1,10,-1,-10];
    var action;
    var tipo;
    var r,c, color=p.color=='blancas'?1:-1;
    if (p.name=='torre') {
			p.movs=this.getNewDataNode();
    }
    
    for (var i=0; i<vd.length; ++i) {
      p.movs.dirs[dir[i]]=[];
      r=p.row; c=p.col;
      while (1) {
        r+=vd[i][0];
        c+=vd[i][1];
        if (r<0 || r>7 || c<0 || c>7) {
          break;
        }
        m=this.ches.matriz[r][c]
        if (m==='') {           // vacio
					if (p.movs.dirs[dir[i]].length==0) {
						p.movs.destinos.push([r,c,i]);
					}         
          
        }
        else {
          if (m*color<0)
            action='ataque';
          else 
            action='defensa'
            
          if (p.movs.dirs[dir[i]].length) { // toca tapado
            tipo='tapado';                    
          }
          else {                // toca directamente
          
            tipo='libre';                    
          
          }
          var ob={
            row:r,
            col:c,
            val:m,
            bando:m*color,
            tapado:p.movs.dirs[dir[i]].length
            
            
          }
					if (action=='ataque' && tipo=='libre') {
						p.movs.destinos.push([r,c,i,ob]);
					}
          p.movs.dirs[dir[i]].push([r,c,m])
          p.movs[tipo][action].push(ob)
        }
      }
      
    }
  }

	Analizer.prototype.analizePeon= function analizePeon(p){
    p.movs=this.getNewDataNode();
    var orientacion = p.orientacion * p.handler.orientacion;
	
    var r,c, color=p.color=='blancas'?1:-1;
 
     
    r=p.row+1*orientacion;
    if (p.col>0) {
      c=p.col-1;
			m = this.ches.matriz[r][c];
			if (m==='') {}
      else {
        var ob={
          row:r,
          col:c,
          val:m,
          bando:m*color,
          tapado:0
        }
        if (ob.bando>0) {
            p.movs.libre.defensa.push(ob)
        }
        else {
            p.movs.libre.ataque.push(ob)
        }

      }
    }
    if (p.col<7) {
      c=p.col+1;
			m = this.ches.matriz[r][c];
			if (m==='') {}
      else {
        var ob={
          row:r,
          col:c,
          val:m,
          bando:m*color,
          tapado:0
        }
        if (ob.bando>0) {
            p.movs.libre.defensa.push(ob)
        }
        else {
            p.movs.libre.ataque.push(ob)
        }

      }
    }
  }  
 
	Analizer.prototype.analizeRey= function analizeRey(p){
    var vd = [[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0]];
    var dir = [11,10,9,-1,-11,-10,-9,1];
    var action;
    var tipo;
    var r,c, color=p.color=='blancas'?1:-1;
    p.movs=this.getNewDataNode();
    for (var i=0; i<vd.length; ++i) {
      r=p.row+vd[i][0];
      c=p.col+vd[i][1];
      p.movs.dirs[dir[i]]=[];
      if (r<0 || r>7 || c<0 || c>7) {
          continue;
        }      
      m = this.ches.matriz[r][c];
      if (m==='') {
      }
      else {
        if (m*color<0)
          action='ataque';
        else 
          action='defensa';
          
        var ob={
          row:r,
          col:c,
          val:m,
          bando:m*color,
          tapado:p.movs.dirs[dir[i]].length
        }
        p.movs.dirs[dir[i]].push([r,c,m])
        p.movs.libre[action].push(ob)
      }
    }      
  }
  
	Analizer.prototype.analizeCaballo= function analizeCaballo(p){
    
    var vd = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];
    var dir = [12,21,19,8,-12,-21,-19,-8];
    var action;
    var tipo;
    var r,c, color=p.color=='blancas'?1:-1;
    p.movs=this.getNewDataNode();
		
    for (var i=0; i<vd.length; ++i) {
      r=p.row+vd[i][0];
      c=p.col+vd[i][1];
      p.movs.dirs[dir[i]]=[];
      if (r<0 || r>7 || c<0 || c>7) {
          continue;
        }      
      m = this.ches.matriz[r][c];
      if (m==='') {
				p.movs.destinos.push([r,c,i]);
      }
      else {
        if (m*color<0)
          action='ataque';
        else 
          action='defensa';
        tipo='libre';
      
        var ob={
          row:r,
          col:c,
          val:m,
          bando:m*color,
          tapado:0
        }
        p.movs.dirs[dir[i]].push([r,c,m])
        p.movs[tipo][action].push(ob)
      }
    }
    
  }
  
	Analizer.prototype.analizeAlfil= function analizeAlfil(p){
    var vd = [[1,1],[-1,1],[-1,-1],[1,-1]];
    var dir = [1+2,-1+2,-1-2,1-2];
    var action;
    var tipo;
    var r,c, color=p.color=='blancas'?1:-1;
    p.movs=this.getNewDataNode();
    
    for (var i=0; i<vd.length; ++i) {
      p.movs.dirs[dir[i]]=[];
      r=p.row; c=p.col;
      while (1) {
        r+=vd[i][0];
        c+=vd[i][1];
        if (r<0 || r>7 || c<0 || c>7) {
          break;
        }
        m=this.ches.matriz[r][c]
        if (m==='') {           // vacio
					if (p.movs.dirs[dir[i]].length==0) {
						p.movs.destinos.push([r,c,i]);
					}         
        }
        else {
          if (m*color<0) 
            action='ataque';
          else 
            action='defensa'
            
          if (p.movs.dirs[dir[i]].length) { // toca tapado
            tipo='tapado';                    
          }
          else {                // toca directamente
          
            tipo='libre';
          
          }
          var ob={
            row:r,
            col:c,
            val:m,
            bando:m*color,
            tapado:p.movs.dirs[dir[i]].length
          }
					if (action=='ataque' && tipo=='libre') {
						p.movs.destinos.push([r,c,i,ob]);
					}
          p.movs.dirs[dir[i]].push([r,c,m])
          p.movs[tipo][action].push(ob)
        }
      }
      
    }
  }
  
	Analizer.prototype.analizeAtacado= function analizeAtacado(j,p){
		var jug = p.color=='blanco'? 'blanco': 'negro';
		var jug2 = p.color=='blanco'? 'negro':'blanco'
		this.analizeDefensa(jug,p);
		this.analizeDefensa(jug2,p);
		
	}

	Analizer.prototype.analizeDefensa= function analizeDefensa(j,p){
    var d=p.movs.libre.defensa.concat(p.movs.tapado.defensa),
    r,c, index, tapado;
    if (d.length) {
      var jug = this.ches[j];
      for (var i=0; i<d.length; ++i) {
        index=d[i].row*8+d[i].col;
        var pp=jug.getPiezaByGUID(this.indexs[index])
				tapado='libre'	;
        if (d[i].tapado) {
					//var pp=jug.getPiezaByValueAndCoord([d[i].row,d[i].col],d[i].val);
					if (!this.esAtaqueTapado(p,pp,true))
						continue;
					tapado='tapado';
				}
        if (!jug.defendidos[pp.internalGUID])
          jug.defendidos[pp.internalGUID]=[];
        jug.defendidos[pp.internalGUID].push([p.internalGUID, p.row, p.col, p.value,tapado]);
      }
    }
  }

	Analizer.prototype.analizeAtaque= function analizeAtaque(j,p){
    var d=p.movs.libre.ataque,
    r,c, index;
    var jug = this.ches[j];
		var jug2 = this.ches[(j=='blanco')?'negro':'blanco'];
    if (!jug.atacados) jug.atacados={}
    if (d.length) {
      for (var i=0; i<d.length; ++i) {
        index=d[i].row*8+d[i].col;
        var pp=jug.getPiezaByGUID(this.indexs[index])
        if (!pp)continue;
        if (!jug.atacados[pp.internalGUID])
          jug.atacados[pp.internalGUID]=[];
         
        jug.atacados[pp.internalGUID].push([p.internalGUID, p.row, p.col, p.value,pp.row*8+pp.col]);
      }
    }
  }

	Analizer.prototype.analizeAtaqueDefensa= function analizeAtaqueDefensa(){
		var jug = ['blanco','negro'], tipos=['libre','tapado'];
		var vp1, p1, p2, jug2, va;
		for (var i=0; i<2; ++i) {
			vp1 = this.ches[jug[i]].piezas;
			jug2 = this.ches[jug[1-i]];
			for (var j in vp1) {
				for (var k=0; k<vp1[j].length; ++k) {
					p1=vp1[j][k].pieza;
					if (p1.state) {
						for (var t=0; t<tipos.length; ++t) {
							va = p1.movs[tipos[t]].ataque;
							for (var l=0; l<va.length; ++l) {
								p2 = jug2.getPiezaByValueAndGUID(this.indexs[va[l].row*8+va[l].col],va[l].val);
								if (!jug2.atacados[p2.internalGUID]) jug2.atacados[p2.internalGUID]=[];
								jug2.atacados[p2.internalGUID].push([p1.internalGUID, p1.row, p1.col, p1.value,tipos[t],va[l].row*8+va[l].col]);
							}
						}
					}
				}
			}
		}
	}
	
	Analizer.prototype.analizePieza= function analizePieza(p){
    this.indexs[p.row*8+p.col]=p.internalGUID;
    switch(p.name) {
      case 'peon': this.analizePeon(p); break;
      case 'caballo': this.analizeCaballo(p); break;
      case 'alfil': this.analizeAlfil(p); break;
      case 'torre': this.analizeTorre(p); break;
      case 'reina':  this.analizeAlfil(p);this.analizeTorre(p);break;
      case 'rey': this.analizeRey(p); break;
    }
  }

	Analizer.prototype.analize_= function analize(jugador){
    return;
    this.indexs={};
    
    var piezas={}, 
        vj = ['blanco','negro'];
    for (var j=0; j<2; ++j) {
      piezas = this.ches[vj[j]].piezas;
      for (var i in piezas) {
        for (var k=0; k<piezas[i].length; ++k) {
          if (piezas[i][k].pieza.state)
            this.analizePieza(piezas[i][k].pieza)
        }
      }
    }
    
    for (var j=0; j<2; ++j) {
      piezas = this.ches[vj[j]].piezas;
      this.ches[vj[j]].defendidos={};
      this.ches[vj[j]].atacados={};
      
      for (var i in piezas) {
        for (var k=0; k<piezas[i].length; ++k) {
          if (piezas[i][k].pieza.state) {
//            this.analizeAtaque(vj[j],piezas[i][k].pieza)
            this.analizeDefensa(vj[j],piezas[i][k].pieza)
          }
        }
      }
    }
		this.analizeAtaqueDefensa();
		// var piezas2;
		// for (var j=0; j<2; ++j) {
		      // piezas = this.ches[vj[j]].piezas;
					// piezas2 = this.ches[vj[1-j]].piezas;
      // this.ches[vj[j]].defendidos={};
      // this.ches[vj[1-j]].atacados={};
      
      // for (var i in piezas) {
        // for (var k=0; k<piezas[i].length; ++k) {
          // if (piezas[i][k].pieza.state) {
						// this.analizeAtaqueDefensa(vj[j],piezas[i][k].pieza);
            // // this.analizeAtaque(vj[j],piezas[i][k].pieza)
            // // this.analizeDefensa(vj[j],piezas[i][k].pieza)
          // }
        // }
      // }

		// }
  }

	Analizer.prototype.getNewDataNode= function getNewDataNode(){
		return {
			libre:{ataque:[],movs:[],defensa:[],atacado:[]}, 
      tapado:{ataque:[],movs:[],defensa:[],atacado:[]},
      dirs:{},
			destinos:[]
    }	
	}

	Analizer.prototype.getNewDataNode__= function getNewDataNode__(){
		return {
			libre:{ataque:[],movs:[],defensa:[],atacado:[]}, 
      tapado:{ataque:[],movs:[],defensa:[],atacado:[]},
      dirs:{},
      cells:{}
    }	
	}
	
  Analizer.prototype.analize__= function analize__(jugador){
    var jug = 'blanco';
    var piezas = this.ches[jug].piezas;
    var itp, ip;
		var jugadores = ['blanco','negro']
		var jugador1, jugador2, piezas1, piezas2, p, pd;
    var libres, tapados, o, od, oo, color;
		this.cels=[];
		for (var i=0; i<8; ++i) {
			this.cels.push([]);
			for (var j=0; j<8; ++j) {
				this.cels[i].push({val:'',blancas:[],negras:[]});
			}
		}
		var tipos = ['libre','tapado'];
		this.indexs={};
		for (var jug=0; jug<jugadores.length; ++jug) {
			piezas = this.ches[jugadores[jug]].piezas;
			for (var itp in piezas) {
				for (var ip=0; ip<piezas[itp].length; ++ip) {
					p = piezas[itp][ip].pieza;
					if (!p.state) continue;
					p.fill();
					this.indexs[p.row*8+p.col]=[p.internalGUID,p.color,p.value];
					var o = this.cels[p.row][p.col];
					o.val=p.value;
					
					for (var t=0; t<tipos.length; ++t){
					
						for (var i in p.actions[tipos[t]]) {
							for (var j=0; j<p.actions[tipos[t]][i].length; ++j) {
								var act = p.actions[tipos[t]][i][j];
								if (act.val==='')
									continue;
								oo=this.cels[act.row][act.col];
								color = act.val>0?'blancas':'negras';
								if (t==0) {
									switch (i) {
										case 'toca':
											oo[color].push(act);
										break;
										case 'defensa':
										case 'ataque':
											oo[color].push(act);
										break;
									}
								}
								else {
									switch(i) {
										case 'toca':
											oo[color].push(act);
										break;
										case 'defensa':
										case 'ataque':
											if (act.orden==1) {
												oo[color].push(act);
											}
										break;
									}
								}
							}
						}
					}
				}
			}
		}
  }

  Analizer.prototype.toca= function analize(jugador){
	}

  Analizer.prototype.analize= function analize(jugador){
    //return this.analize__();
    return this.analize_();
    var info, ii=0, vm, p, m, r, c, v, vj=['blanco','negro'], jug;
		
		this.matriz = [];
		for (var i=0; i<8; ++i) {
			v=[];
			for (var j=0; j<8; ++j) {
				v.push({ocupado:null, tocado:{blancas:[],negras:[]}, atacado:{blancas:[],negras:[]}, defendido:{blancas:[],negras:[]}, rayosX:{blancas:[],negras:[]}});
			}
			this.matriz.push(v);
		}
		this.infos=[];
		var dr,dc,vdd, dd;
	for (var jug=0;jug < vj.length; ++jug) {
		vp = this.ches[vj[jug]].piezas;
		for (var i in vp) {
			for (var k=0; k<vp[i].length; ++k) {
				p = vp[i][k].pieza;
				if (p.state==-1)
					continue;
				ii = this.infos.length; 
				this.infos.push(p.getInfo('ANALISIS_1'));
				this.matriz[p.row][p.col].ocupado = this.infos[ii];
				vm=null;
					switch(i) {
						case 'queen':
							vm = this.ches.getMovimientos(p,true);
							vdd=[null,null,null,null,null,null,null,null];
							for (var j=0; j<vm.length; ++j) {
								r=vm[j][0];
								c=vm[j][1];
								m=this.ches.matriz[r][c];
								if (m=='') {
									this.matriz[r][c].atacado={blancas:[],negras:[]};
									this.matriz[r][c].defendido={blancas:[],negras:[]};
								}
								else {
									if (r==p.row) {
										if (c>c.col) 
											dd=4;
										else
											dd=5;
									}
									else if (c==p.col) {
										if (r>p.row)
											dd=6;
										else
											dd=7;
									}
									else {
										if (r>p.row) {
											if (c>p.col) {
												dd=0;
											}
											else dd=1;
										}
										else {
											if (c>p.col) 
												dd=2;
											else
												dd=3;
										}
									}
									if (vdd[dd]==null) vdd[dd]=1;
									else {
										++vdd[dd];
										if (p.value<0) {
											this.matriz[r][c].rayosX[p.color].push([p.row,p.col,p.value,vdd[dd]]);
										}
										else
											this.matriz[r][c].rayosX[p.color].push([p.row,p.col,p.value,vdd[dd]]);
									}
								}
							}							
						case 'row':
						case 'bishop':
							if (i!='queen') {
								vm = this.ches.getMovimientos(p,true);
								vdd=[null,null,null,null]
								for (var j=0; j<vm.length; ++j) {
									r=vm[j][0];
									c=vm[j][1];
									m=this.ches.matriz[r][c];
									if (m=='') {
										this.matriz[r][c].atacado={blancas:[],negras:[]};
										this.matriz[r][c].defendido={blancas:[],negras:[]};
									}
									else {
										if (r>p.row) {
											if (c>p.col) {
												dd=0;
											}
											else dd=1;
										}
										else {
											if (c>p.col) 
												dd=2;
											else
												dd=3;
										}
										if (vdd[dd]==null) vdd[dd]=1;
										else {
											vdd[dd]++;
											if (p.value<0) {
												this.matriz[r][c].rayosX[p.color].push([p.row,p.col,p.value,vdd[dd]]);
											}
											else
												this.matriz[r][c].rayosX[p.color].push([p.row,p.col,p.value,vdd[dd]]);
										}
									}
								} // end for j: itera vector con todas las casillas tocadas por la pieza p
							}
						case 'pawn':
						case 'horse':
							vm = this.ches.getTocados(p,true);
							for (var j=0; j<vm.length; ++j) {
								r=vm[j][0];
								c=vm[j][1];
								m=this.ches.matriz[r][c];
								if (m=='') {
									this.matriz[r][c].ocupado=null;
									this.matriz[r][c].tocado[p.color].push(ii);
									this.matriz[r][c].atacado={blancas:[],negras:[]};
									this.matriz[r][c].defendido={blancas:[],negras:[]};
								}
								else {
									this.matriz[r][c].tocado[p.color].push(ii);
									if (m*p.value<0) {
										this.matriz[r][c].atacado[p.color].push(ii);
									}
									else {
										this.matriz[r][c].defendido[p.color].push(ii);
									}
								}
							} // end for j: itera vector con todas las casillas tocadas por la pieza p
						break;
					} // end switch(i) i:nombre de pieza en ingles
			} // end for k: itera el vector de piezas de un jugador para un tipo de pieza
		} // end i. itera los tipos de piezas de un jugador
	} // end jug: itera jugadores (blanco,negro)
  
	}

	Analizer.prototype.init=function init(r,c){
    this.ches=chess.chesses[c];
//    this.prioridad(1);
  }
  
	function Analizer(){
		
    
	}

	return instance ? instance : instance = new Analizer();
})()
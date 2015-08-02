
var socket = io.connect('https://chess-sebastiangima.rhcloud.com:8443/', {'forceNew':true });
var socket = io.connect(document.location);
//al actualizar la página eliminamos la sesión del usuario de sessionStorage
$(document).ready(function() {
    self.document.title="SGCHESSLAN"
		manageSessions.unset("login");
});

//función para mantener el scroll siempre al final del div donde se muestran los mensajes
//con una pequeña animación
function animateScroll() {
    var container = $('#containerMessages');
    container.animate({"scrollTop": $('#containerMessages')[0].scrollHeight}, "slow");
}

//función anónima donde vamos añadiendo toda la funcionalidad del chat
$(function() {
    //llamamos a la función que mantiene el scroll al fondo
    animateScroll();
    //si el usuario no ha iniciado sesión prevenimos que pueda acceder

		var div = document.createElement('DIV');

		div.innerHTML=renderForm('aleatorio_'+Math.random(100).toString().substr(0,7));

		document.body.appendChild(div);
		//showModal("Formulario de inicio de sesión",renderForm());

    //al poner el foco en el campo de texto del mensaje o pulsar el botón de enviar
    $("#containerSendMessages, #containerSendMessages input").on("s click", function(e){
        e.preventDefault();
        if(!manageSessions.get("login"))
        {
            showModal("Formulario de inicio de sesión",renderForm(), false);
        }
    });

    //al pulsar en el botón de Entrar 
    $("#loginBtn").on("click", function(e){
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        if($(".username").val().length < 2)
        {
            //ocultamos el mensaje de error
            $(".errorMsg").hide();
            //mostramos el mensaje de nuevo y ponemos el foco en el campo de texto
            $(".username").after("<div class='col-md-12 alert alert-danger errorMsg'>Debes introducir un nombre para acceder al chat.</div>").focus(); 
            //cortamos la ejecución
            return;
        }
        //en otro caso, creamos la sesión login y lanzamos el evento loginUser
        //pasando el nombre del usuario que se ha conectado
        manageSessions.set("login", $(".username").val());
        //llamamos al evento loginUser, el cuál creará un nuevo socket asociado a nuestro usuario
        socket.emit("loginUser", manageSessions.get("login"));
        //ocultamos la ventana modal
        $("#formModal").modal("hide");
        //llamamos a la función que mantiene el scroll al fondo
					animateScroll();
    });
		
		document.body.querySelector('button.top-bar.new').onclick=function() { var e = arguments[0];
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        socket.emit("newRoom", manageSessions.get("login"),('room_'+guid).substr(0,10));
        
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubbles=true;
				return false;
    };    

		rooms.initListeners();
		macro(40);

		
    $(".rooms-container").on("click", function(e){
			this.style.zIndex = 11;
		})
		
    $(".roon_in").on("click", function(e){
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        //socket.emit("roon_in", manageSessions.get("login"), );
        
    });    		
		
    $(".unirse").on("click", function(e){
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        socket.emit("unirse", manageSessions.get("login"));
        
    });    

    $(".unirseN").on("click", function(e){
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        socket.emit("unirseN", manageSessions.get("login"));
        
    });    
    
		$("body").on("keydown", function(e){
			if(e.keyCode==65){
				macro(41,'LEFT')
			}
		})
		$(".comenzar").on("click", function(e){
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        //socket.emit("comenzar", manageSessions.get("login"));
        chess.acomodar(message);
        
    });      

    $(".salir").on("click", function(e) {
        e.preventDefault();
        if (e.target && e.target.className && e.target.className.indexOf('salir')>=0) {
          this.rooms[e.target.getAttribute('room')].onSalir(e);
        }
    });
    
    $(".orientacion").on("click", function(e){
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        chess.changeOrientacion();
        
    });    

    //si el usuario está en uso lanzamos el evento userInUse y mostramos el mensaje
    socket.on("userInUse", function()  {
        //mostramos la ventana modal
        $("#formModal").modal("show");
        //eliminamos la sesión que se ha creado relacionada al usuario
        manageSessions.unset("login");
        //ocultamos los mensajes de error de la modal
        $(".errorMsg").hide();
        //añadimos un nuevo mensaje de error y ponemos el foco en el campo de texto de la modal
        $(".username").after("<div class='col-md-12 alert alert-danger errorMsg'>El usuario que intenta escoge está en uso.</div>").focus();
        return; 
    });

    socket.on("macroBroadcast", function(p) {
			macro.apply(null,p.slice())
		});
		
    socket.on("noMorePlayer", function(user) {
			chess.noMorePlayer(user);
		});
		
		socket.on("updateJugadas", function(jugada){
			chess.chesses[jugada.chessid].updateJugada(jugada);
		});
    
		socket.on("updateUsers", function(users){
      chess.updatePlayer(users);
      var user = manageSessions.get("login");
        //limpiamos el sidebar donde almacenamos usuarios
        if(!isEmptyObject(users))
        {
					$('#'+users[1])[0].innerHTML=users[0];
					if (users.length==4) {
            $('#'+users[3])[0].innerHTML=users[2];
            if (users[1]=='blancas') {
              if (users[0]==user) {
                $('.comenzar')[0].removeAttribute('disabled');
              }
            }
            else if (users[2]==user) {
            }
					}
         
        }
    });
    //cuando se emite el evente refreshChat
    socket.on("refreshChat", function(action, message){
        //simplemente mostramos el nuevo mensaje a los usuarios
        //si es una nueva conexión
        if(action == "conectado")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-info'>" + message + "</p>");
        }
        //si es una desconexión
        else if(action == "desconectado")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-danger'>" + message + "</p>");
        }
        else if(action == "acomodar") 
        {
          chess.acomodar(message);
          chess.setTurno('blancas');
        }
        else if(action == "jugadas") 
        {
          chess.setJugadas(message);
        }
        //si se trata de unirse  
        else if(action == "unirse")
        {
          var o='';
					for (var i in message) {
            $('#'+message[i])[0].innerHTML=i;
            chess.updatePlayer([i,message[i]]);
            
          }
        }
        //si es un nuevo mensaje 
        else if(action == "msg")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-warning'>" + message + "</p>");
        }
        //si el que ha conectado soy yo
        else if(action == "yo")
        {
            $("#chatMsgs").append("<p class='col-md-12 alert-success'>" + message + "</p>");
        }
        //llamamos a la función que mantiene el scroll al fondo
        animateScroll();
    });

		socket.on("invitando", function(roomid,userid) {
			
			confirm
		});
		socket.on("onInvitar", function(roomid,userid,result) {
			
		});
		socket.on("onSetChessId", function(roomid,chessid) {
			rooms.setChessId(roomid,chessid);
		})
		socket.on("inRoomSetColor", function(userid,roomid,color) {
			rooms.setColorInList(userid,roomid,color);
			rooms.setColorInRoom(userid,roomid,color);
			
		});
		
		socket.on("onSolicitudAnular1", function(roomid,chessid,userid) {
			if (userid==manageSessions.get('login')) {
				rooms.onSolicitudAnular1(roomid,chessid,userid);
			}
		});

		socket.on("onAceptarSolicitud", function(roomid,chessid,userid) {
//			if (userid==manageSessions.get('login')) {
				rooms.onAceptarSolicitud(roomid,chessid,userid);
	//		}
		});

		socket.on("invitando", function(roomid,userid,result) {
			
		})
		socket.on("onInvitar", function(roomid,userid,result) {
		});
		socket.on("roomSetColor", function(userid,roomid,color) {
			rooms.setColorInList(userid,roomid,color);
		});

		socket.on("inRoomUnSetColor", function(userid,roomid,color) {
			rooms.unSetColorInList(userid,roomid,color);
			rooms.unSetColorInRoom(userid,roomid,color);
		});
		
		socket.on("roomUnSetColor", function(userid,roomid,color) {
			rooms.unSetColorInList(userid,roomid,color);
		});

    socket.on("onReset", function(room) {
      rooms.onReset(room);
    });
    
    socket.on("onClean", function(room) {
      rooms.onClean(room);
    });

    socket.on("createRoom", function(room) {
			var r=new Room(room);
			rooms.add(r);
			rooms.addToList(r);
			if (room.owner==manageSessions.get('login')) {
				rooms.activarSolapa(r.roomid)
				 var act=rooms.rooms[rooms.solapaActiva]
					 if(act) act.hide()
				 r.show();
				
			}
			else
				r.hide();
		});
				
		socket.on("onOptionsChange", function(roomid,option,value) {
			rooms.changeOption(roomid,option,value);
		});
		
		socket.on("newRoom_", function(owner,room) {
			var a = {
				owner: room.owner,
				roomid: room.roomid,
				BLANCAS: room.BLANCAS,
				NEGRAS: room.NEGRAS,
				mxp: room.mxp,
				ixj: room.ixj,
				ti: room.ti,
				tiempo: room.tiempo
			}
			rooms.add(new Room(a));
			//rooms.add(new Room({'owner':owner,'roomid':roomid}));
			room.hide();
		});

		socket.on("startGame", function(roomid) {
			rooms.start(roomid);
		});
		
				
		socket.on("createChess", function(owner,userid,roomid,chessid) {
			var r=new Room({owner:manageSessions.get('login'),'roomid':roomid});
			rooms.add(r);
			rooms.addToList(r);
			if (userid==manageSessions.get('login'))
				r.show();
		
		});


		socket.on("coronado", function(chessid, from, to, jaque, jugada, coronado) {
			chess.chesses[chessid].remoteCoronation(from,to,jaque,jugada,coronado);
			if (jaque) {
				chess.chesses[chessid].jaque();
			}
      
		});
		
		socket.on("moving", function(chessid, from, to, jaque, coronado,pasarTurno) {
			chess.chesses[chessid].move(from,to,true,pasarTurno,false,coronado);
			if (jaque) {
				chess.chesses[chessid].jaque();
			}
      
		});
    
		//actualizamos el sidebar que contiene los usuarios conectados cuando
    //alguno se conecta o desconecta, el parámetro son los usuarios online actualmente
    socket.on("updateSidebarUsers", function(usersOnline){
        //limpiamos el sidebar donde almacenamos usuarios
        $("#jugadores").html("");
        //si hay usuarios conectados, para evitar errores
        if(!isEmptyObject(usersOnline))
        {
            //recorremos el objeto y los mostramos en el sidebar, los datos
            //están almacenados con {clave : valor}
            $.each(usersOnline, function(key, val)
            {
                $("#chatUsers").append("<p class='col-md-12 alert-info'>" + key + "</p>");
            })
        }
    });

    //al pulsar el botón de enviar mensaje
    $('.sendMsg').on("click", function() {
        //capturamos el valor del campo de texto donde se escriben los mensajes
        var message = $(".message").val();
        if(message.length > 2)
        {
            //emitimos el evento addNewMessage, el cuál simplemente mostrará
            //el mensaje escrito en el chat con nuestro nombre, el cuál 
            //permanece en la sesión del socket relacionado a mi conexión
            socket.emit("addNewMessage", message);
            //limpiamos el mensaje
            $(".message").val("");
        }
        else
        {
            showModal("Error formulario","<p class='alert alert-danger'>El mensaje debe ser de al menos dos carácteres.</p>", "true");
        }
        //llamamos a la función que mantiene el scroll al fondo
        animateScroll();
    });
		document.getElementById('loginBtn').click();

});

//funcion que recibe como parametros el titulo y el mensaje de la ventana modal
//reaprovechar codigo siempre que se pueda
function showModal(title,message,showClose) {
    console.log(showClose)
    $("h2.title-modal").text(title).css({"text-align":"center"});
    $("p.formModal").html(message);
    if(showClose == "true")
    {
        $(".modal-footer").html('<a data-dismiss="modal" aria-hidden="true" class="btn btn-danger">Cerrar</a>');
        $("#formModal").modal({show:true});
    }
    else
    {
        $("#formModal").modal({show:true, backdrop: 'static', keyboard: true });
    }
}

//formulario html para mostrar en la ventana modal
function renderForm(user){
    var html = "";
    html += '<div class="form-group nologin" id="formLogin">';
    html += '<input type="text" id="username" class="form-control username" placeholder="Introduce un nombre de usuario" value="'+user+'" />';
    html += '</div>';
    html += '<button type="submit" class="btn btn-primary btn-large" id="loginBtn">Entrar</button>';
    return html;
}

//objeto para el manejo de sesiones
var manageSessions = {
    //obtenemos una sesión //getter
    get: function(key) {
        return sessionStorage.getItem(key);
    },
    //creamos una sesión //setter
    set: function(key, val) {
        return sessionStorage.setItem(key, val);
    },
    //limpiamos una sesión
    unset: function(key) {
        return sessionStorage.removeItem(key);
    }
};

//función que comprueba si un objeto está vacio, devuelve un boolean
function isEmptyObject(obj) {
    var name;
    for (name in obj) 
    {
        return false;
    }
    return true;
}
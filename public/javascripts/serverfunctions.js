

var socket = io.connect(document.location);
//al actualizar la página eliminamos la sesión del usuario de sessionStorage
$(document).ready(function() {
    manageSessions.unset("login");
});


//función anónima donde vamos añadiendo toda la funcionalidad del chat
$(function() {
    //llamamos a la función que mantiene el scroll al fondo
    //si el usuario no ha iniciado sesión prevenimos que pueda acceder

		var div = document.createElement('DIV');

		div.innerHTML=renderForm('aleatorio_'+Math.random(100).toString().substr(0,7));

		document.body.appendChild(div);
		//showModal("Formulario de inicio de sesión",renderForm());

    //al poner el foco en el campo de texto del mensaje o pulsar el botón de enviar
    $("#containerSendMessages, #containerSendMessages input").on("focus click", function(e){
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
    });
		
		// document.body.querySelector('button.top-bar.new').onclick=function() { var e = arguments[0];
        // e.preventDefault();
        // //si el nombre de usuario es menor de 2 carácteres
        // socket.emit("newRoom", manageSessions.get("login"),('room_'+guid).substr(0,10));
        
				// if (e.stopPropagation) e.stopPropagation();
				// e.cancelBubbles=true;
				// return false;
    // };    


		
 		
		
    $(".unirse").on("click", function(e){
        e.preventDefault();
        //si el nombre de usuario es menor de 2 carácteres
        socket.emit("unirse", manageSessions.get("login"));
        
    });    
   

    $(".salir").on("click", function(e) {
        e.preventDefault();
        if (e.target && e.target.className && e.target.className.indexOf('salir')>=0) {
          this.rooms[e.target.getAttribute('room')].onSalir(e);
        }
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
var express = require("express"), 
http = require("http"),
app = express(),
server = http.createServer(app,'0.0.0.0'),
path = require('path'),
 fs = require('fs');


unidos = {},
rooms={};

app.use(express.static(path.join(__dirname, 'public')));

app.set("views",__dirname + "/views");
app.configure(function(){
	app.use(express.static(__dirname));
});

app.get("/save", function(req,res){
	console.log(req);
	res.render("index2.jade", {title : "Server functions"});
});
app.get("/", function(req,res){
	
	res.render("index.jade", {title : "Chat con NodeJS, Express, Socket.IO y jQuery"});
});
var usuariosOnline = {};


app.get("/jugadores", function(req,res){
	var result=''
  for (var i in unidos) {
    if (result) result+=',';
    result += unidos[i]+','+i
  }
  
  var body = JSON.stringify(unidos);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(body);  

  
});


server.listen(16543,'0.0.0.0');

//objecto para guardar en la sesión del socket a los que se vayan conectando


function onready(){
console.log('ready')
	
}


var io = require("socket.io").listen(server);
onready()
//al conectar un usuario||socket, este evento viene predefinido por socketio
io.sockets.on('connection', function(socket) 
{
	//cuando el usuario conecta al chat comprobamos si está logueado
	//el parámetro es la sesión login almacenada con sessionStorage
	socket.on("loginUser", function(username)	{
		//si existe el nombre de usuario en el chat
		if(usuariosOnline[username])
		{
			socket.emit("userInUse");
			return;
		}
		//Guardamos el nombre de usuario en la sesión del socket para este cliente
		socket.username = username;
		if(username=='serveruser') {
			return;
		}
		//añadimos al usuario a la lista global donde almacenamos usuarios
		usuariosOnline[username] = socket.username;
		//mostramos al cliente como que se ha conectado
		socket.emit("refreshChat", "yo", "Bienvenido " + socket.username + ", te has conectado correctamente.");
		//mostramos de forma global a todos los usuarios que un usuario
		//se acaba de conectar al chat
		socket.broadcast.emit("refreshChat", "conectado", "El usuario " + socket.username + " se ha conectado al chat.");
		//actualizamos la lista de usuarios en el chat del lado del cliente
		io.sockets.emit("updateSidebarUsers", usuariosOnline);
		

		for (var i in rooms) {
			socket.emit('createRoom',rooms[i]);
		}
		
	});

	//cuando un usuario envia un nuevo mensaje, el parámetro es el 
	//mensaje que ha escrito en la caja de texto
	socket.on('addNewMessage', function(message) 	{
		//pasamos un parámetro, que es el mensaje que ha escrito en el chat, 
		//ésto lo hacemos cuando el usuario pulsa el botón de enviar un nuevo mensaje al chat

		//con socket.emit, el mensaje es para mi
		socket.emit("refreshChat", "msg", "Yo : " + message + ".");
		//con socket.broadcast.emit, es para el resto de usuarios
		socket.broadcast.emit("refreshChat", "msg", socket.username + " dice: " + message + ".");
	});


	//cuando el usuario cierra o actualiza el navegador
	socket.on("newRoom", function(owner,roomid)	{
		//socket.broadcast.emit('newRoom_',owner,roomid);
		if (!rooms[roomid]) {
			rooms[roomid] = {
				'roomid':roomid,
				'owner':owner,
				BLANCAS:'',
				NEGRAS:'',
				chessid:'',
				mxp:0,
				ixj:0,
				ti:0,
				tiempo:0
			}
		}
		io.sockets.emit('createRoom',rooms[roomid]);
		
	});

	socket.on("solicitudAnular1", function(roomid,chessid,userid) {
		socket.broadcast.emit("onSolicitudAnular1", roomid, chessid, userid);
	});
	
	socket.on("invitado", function(roomid,userid,another,result) {
		if(result) {
			for(var i in io.sockets.sockets) { 
				if(io.sockets.sockets[i].userName==userid) {
					io.sockets.sockets[i].emit("onInvitar",roomid,another,result)
				}
			}
		}
			
	});
	
	socket.on("macroBroadcast", function(args) {
		socket.broadcast.emit("macroBroadcast", args);
	});
	socket.on("invitar", function(roomid,chessid,userid) {
		socket.broadcast.emit("invitando", roomid, userid);
		

	
	});
	socket.on("aceptarSolicitud", function(roomid,chessid,userid) {
		socket.broadcast.emit("onAceptarSolicitud", roomid, chessid, userid);
	});

	socket.on("setChessId", function(roomid,chessid) {
		rooms[roomid].chessid=chessid;
		socket.broadcast.emit("onSetChessId", roomid, chessid);
	});
	
	socket.on("changeOptions", function(roomid,option,value) {
		rooms[roomid][option]=value;
		socket.broadcast.emit('onOptionsChange',roomid,option,value);
		
	});
	
	socket.on("setColor", function(user,roomid,color) {
		rooms[roomid][color]=user;
		socket.broadcast.emit('roomSetColor',user,roomid,color);
		io.sockets.emit('inRoomSetColor',user,roomid,color);
	});

	socket.on("unSetColor", function(user,roomid,color) {
		rooms[roomid][color]='';
		socket.broadcast.emit('roomUnSetColor',user,roomid,color);
		io.sockets.emit('inRoomUnSetColor',user,roomid,color);
	});

	//cuando el usuario cierra o actualiza el navegador
	// socket.on("coronar", function(from, to, jaque, jugada, coronado)	{
    // socket.broadcast.emit('coronado',jugada.chessid, from,to,jaque, coronado)
	
	// }
	socket.on("clean", function(roomid)	{
      socket.broadcast.emit('onClean',roomid)
  });
  
	socket.on("reset", function(roomid)	{
      socket.broadcast.emit('onReset',roomid)
  });
  
	socket.on("movimiento", function(from, to, jaque, jugada, coronado)	{
		if(typeof(socket.username) == "undefined")
		{
			return;
		}
		var pasarTurno = jugada && jugada.pasarTurno?jugada.pasarTurno:false;
      socket.broadcast.emit('moving',jugada.chessid,from,to,jaque, coronado,pasarTurno)
		
		if (jugada) {
			if (!jugada.pasarTurno)
				socket.broadcast.emit('updateJugadas',jugada);
		
			//io.sockets.emit('updateJugadas',jugada);
		
		}
	});
	
	socket.on("disconnect", function()	{
		//si el usuario, por ejemplo, sin estar logueado refresca la
		//página, el typeof del socket username es undefined, y el mensaje sería 
		//El usuario undefined se ha desconectado del chat, con ésto lo evitamos
		if(typeof(socket.username) == "undefined")
		{
			return;
		}
		if (unidos[socket.username]) {
			io.sockets.emit("noMorePlayer", socket.usernane);
			delete unidos[socket.username];
		}
		//en otro caso, eliminamos al usuario
		delete usuariosOnline[socket.username];
		//actualizamos la lista de usuarios en el chat, zona cliente
		io.sockets.emit("updateSidebarUsers", usuariosOnline);
		//emitimos el mensaje global a todos los que están conectados con broadcasts
		socket.broadcast.emit("refreshChat", "desconectado", "El usuario " + socket.username + " se ha desconectado del chat.");
	});

	//cuando el usuario cierra o actualiza el navegador
	socket.on("unirse", function()	{
		//si el usuario, por ejemplo, sin estar logueado refresca la
		//página, el typeof del socket username es undefined, y el mensaje sería 
		//El usuario undefined se ha desconectado del chat, con ésto lo evitamos
		if(typeof(socket.username) == "undefined")
		{
			return;
		}
		//en otro caso, eliminamos al usuario
		if (unidos[socket.username]) {
		}
		else {
			unidos[socket.username] = 'blancas'
			
			//actualizamos la lista de usuarios en el chat, zona cliente
			io.sockets.emit("updateUsers", [socket.username, 'blancas']);
			//emitimos el mensaje global a todos los que están conectados con broadcasts
			socket.broadcast.emit("refreshChat", "unirse", unidos);
		}
	});
	//cuando el usuario cierra o actualiza el navegador
	socket.on("unirseN", function()	{
		//si el usuario, por ejemplo, sin estar logueado refresca la
		//página, el typeof del socket username es undefined, y el mensaje sería 
		//El usuario undefined se ha desconectado del chat, con ésto lo evitamos
		if(typeof(socket.username) == "undefined")
		{
			return;
		}
		//en otro caso, eliminamos al usuario
		if (unidos[socket.username]) {
		}
		else {
			unidos[socket.username] = 'negras'
			//actualizamos la lista de usuarios en el chat, zona cliente
			io.sockets.emit("updateUsers", [socket.username, 'negras']);
			//emitimos el mensaje global a todos los que están conectados con broadcasts

			socket.broadcast.emit("refreshChat", "unirse", unidos);
		}
	});
		
	socket.on("comenzar", function(roomid)	{
		//si el usuario, por ejemplo, sin estar logueado refresca la
		//página, el typeof del socket username es undefined, y el mensaje sería 
		//El usuario undefined se ha desconectado del chat, con ésto lo evitamos
		// if(typeof(socket.username) == "undefined")
		// {
			// return;
		// }
		//en otro caso, eliminamos al usuario
			//actualizamos la lista de usuarios en el chat, zona cliente
			//emitimos el mensaje global a todos los que están conectados con broadcasts

		//	io.sockets.emit("startGame", roomid);

			socket.broadcast.emit("startGame", roomid);
		
	});
});

	

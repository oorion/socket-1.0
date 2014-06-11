var http = require("http");
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response){
    console.log('Connection');
    var path = url.parse(request.url).pathname;
    console.log(path);

    switch(path){
    default:
	fs.readFile(__dirname + '/index.html', function(error, data){
            var bufferString = data.toString();
            response.writeHead(200, 'text/html');
            response.write(bufferString, "utf8");
            response.end();
        });
        break;
    }
}).listen(8001);

var io = require('socket.io')(server);

io.on('connection', function(socket) {

    var randid;
    var myid = socket.id;

    socket.on('start', function(data){
	//io.of('/').connected is a Hash of Socket objects that are connected to this namespace indexed by id
//	console.log(io.of('/').connected); 

	//print out keys of 'connected' object
	var keys = Object.keys(io.of('/').connected);

	//select a random socket.id, or in this case key, to connect to
	//pop off this socket.id's key first, then select a random user taking the length of the keys array and doing something
	var indexOfCurrentUser = keys.indexOf(socket.id);
	keys.splice(indexOfCurrentUser, 1);
	
	console.log('keys.length: ' + keys.length);
	console.log(keys);

	if(keys.length >= 1){
	    this.randid = keys[Math.floor(Math.random() * keys.length)];
	    var indexOfRandUser = keys.indexOf(this.randid);
	    keys.splice(indexOfRandUser, 1);

	    console.log(keys);

            //note: the first person to click start doesn't have a randid    
            console.log('randid: ' + this.randid);

            //make user join randid + socket.id room                                                                                           
            socket.join(this.randid);
	}

	console.log('socket.id: ' + socket.id);
	console.log('socket.rooms: ' + socket.rooms);
	

	//try to figure out a way to link two ids or connect them in some way.  maybe ask irc?  do some research on my own first
    });

    socket.on('message', function(data){
	console.log('data.message: ' + data.message);
	console.log('data.color: ' + data.color);
	console.log('data.path: ' + data.path);

	//remove this once I get io.of('/test') working
	io.to(this.randid).emit('message', data);

	//this isn't working
	io.to(this.myid).emit('message', data);
    });
});



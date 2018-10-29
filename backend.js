let express = require('express'); //make express available
let app = express(); //invoke express
let server = require('http').Server( app ) // start the express server instance
let io = require('socket.io')(server) // use socket.io for real time connections aka. wesockets
let port = 3000;
let cursorList = {};

//serve out any static files in our public HTML folder
app.use(express.static('public'));

//do something when someone connects to our page.
io.on('connection', function(socket){
//  console.log(socket.id); // log out the unique ID of each person who connects
    console.log(socket.id + ' joined');
    socket.emit('serverkey', socket.id);

  // this section is a bit of an information 'relay' it takes the incoming data, replicates it and sends it out to everyone who is connected.
  //look for an incoming addEmoji message from the client
  socket.on('updateCursor', function(data){
      cursorList[socket.id] = data;

      io.emit('massSendCursor', [data[0], data[1], socket.id]) //send the massSendEmoji message out to all of the connected clients.
  })
  
  socket.on('disconnect', function(){
      console.log(socket.id + ' disconnected');
      io.emit('massDeleteCursor', socket.id);
      delete cursorList[socket.id];
  })
  
  Object.keys(cursorList).forEach(function(key){
      io.emit('massSendCursor', [cursorList[key][0], cursorList[key][1], key])
  })

})

//makes the app listen for requests on port we set
server.listen(port, function(){
  console.log("server started on: " + port)
})

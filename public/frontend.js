let socket = io.connect();
let cursorList = {};
let dataToSend;
let id;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

socket.on('connect', function(data){
})

socket.on('serverkey', function(data){
    console.log(data + " joined the fun");
    id = data;
})

$('html').on("mousemove", function(event) {
  
  let dataToSend = [event.clientY, event.clientX];

  socket.emit('updateCursor', dataToSend); // send the data up to the server

});

socket.on('massSendCursor', function(data){
    cursorList[data[2]] = data;
})

socket.on('massDeleteCursor', function(data){
    console.log(data);
    delete cursorList[data];
})

function draw(ctx) {
    ctx.clearRect(0, 0, 3000, 3000);
    let mouseimg = new Image();
    mouseimg.src = "cursor.svg";
    Object.keys(cursorList).forEach(function(key){
        ctx.drawImage(mouseimg, cursorList[key][1], cursorList[key][0])
    })
}

window.setInterval(function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw(ctx);
}, 16);


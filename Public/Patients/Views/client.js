var ul = document.getElementById("messageslist");
var inputmessage = document.getElementById("m");
var currentdate = new Date();
var datetime = +currentdate.getDate() + "/" 
                        + (currentdate.getMonth() + 1) + "/" 
                        + currentdate.getFullYear() + " @ " 
                        + currentdate.getHours() + ":" 
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
var socket = io();

///click event when form is submiited 
$('form').submit(function () {
    
    if (inputmessage.value == undefined || inputmessage.value == '') {
        alert('please enter some message');
        return;
    }
    
    li = document.createElement("li");
    li.appendChild(document.createTextNode(inputmessage.value + datetime));
    ul.appendChild(li);
    
    socket.emit('chat message', inputmessage.value);
    inputmessage.value = '';
    
    
    return false;
});

//to recive messsage from server and adding into list
socket.on('ack', function (msg) {
    
    li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    ul.appendChild(li);
});

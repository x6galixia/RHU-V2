const socket = new WebSocket('ws://localhost:3000');

socket.onopen = function (event) {
    console.log('Connected to the WebSocket server');
};

socket.onmessage = function (event) {
    console.log('Message from server: ', event.data);
};

socket.onclose = function (event) {
    console.log('Disconnected from the WebSocket server');
};

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    socket.send(message);
}
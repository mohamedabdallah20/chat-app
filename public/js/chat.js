const socket = io()

socket.on('message', (text) => {
    console.log(text)
})

const form = document.getElementById('messageForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    // const messageInput = document.getElementById('message');
    const messageInput = event.target.elements.message
    const message = messageInput.value;
    
    socket.emit('sendMessage', message);
    messageInput.value = '';
})


const socket = io()


//elements
const $messageForm = document.getElementById('messageForm');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('#submit-button');
const $messages = document.querySelector('#messages');
const $sendLocationbutton = document.querySelector('#send-location');


//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML




socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled')
    // const messageInput = document.getElementById('message');
    const messageInput = event.target.elements.message
    const message = messageInput.value;

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus()

        if (error) { return console.log(error) }
        console.log('message delivered')
    });
})

$sendLocationbutton.addEventListener('click', () => {
    // console.log("test location")
    if (!navigator.geolocation) {
        return alert('the geolocation does not support by your browser')
    }
    $sendLocationbutton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        const currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', currentLocation, () => {
            $sendLocationbutton.removeAttribute('disabled')
            console.log("location shared!")
        })
    })

})


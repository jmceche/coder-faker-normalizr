
const socket = io();

socket.on('render_messages', data => {
  renderMessages(data);
});

// product list functions
const submitProduct = (e) => {
  e.preventDefault()
  const product = {
      title: document.querySelector('#title').value,
      price: document.querySelector('#price').value,
  }
  socket.emit('submit_product', product);
}

// Chat functions
const sendMsg = (e) => {
  e.preventDefault();
  const msg = {
    author: {
      email: document.querySelector('#email').value,
      nombre: document.querySelector('#nombre').value,
      apellido: document.querySelector('#nombre').value,
      edad: document.querySelector('#edad').value,
      alias: document.querySelector('#alias').value,
      avatar: document.querySelector('#avatar').value,
    },
    text: document.querySelector('#text').value,
  }
  socket.emit('send_message', msg)
}

const renderMessages = (data) => {
  console.log(data);
  // let html = data.entities.chats.map(item => `<p><span class="">${item.author.alias}</span> <span class="timestamp">[${item.timestamp}]</span>: <span class="user-msg">${item.text}</span></p>`);
  // let html = `<p>${data.entities}</p>`
  // const body = document.querySelector('#chat-msgs')
  // body.innerHTML = html//.join("");
}
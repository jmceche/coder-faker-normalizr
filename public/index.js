const socket = io();

socket.on('render_messages', data => {
  renderMessages(data);
});

// product list functions
const submitProduct = (e) => {
  e.preventDefault()
  const product = {
    name: document.querySelector('#name').value,
    price: document.querySelector('#price').value,
    thumbnail: document.querySelector("#thumbnail").value
  }
  console.log(product);
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
  const author = new normalizr.schema.Entity('authors', {}, {
    idAttribute: 'email'
  });

  const post = new normalizr.schema.Entity('posts', {
    author,
  }, {idAttribute: '_id'});

  const chat = new normalizr.schema.Entity('chats', {
    mensajes: [post],
  })

  const denormalizedData = normalizr.denormalize(data.result, chat, data.entities);
  const { mensajes } = denormalizedData;
  console.log(data);
  const rate = JSON.stringify(data).length / JSON.stringify(denormalizedData).length;

  let html = mensajes.map(item => `<p><span class="">${item.author.alias}</span> <span class="timestamp">[${item.createdAt}]</span>: <span class="user-msg">${item.text}</span></p>`);
  const body = document.querySelector('#chat-msgs');
  body.innerHTML = html.join("");
  const h3 = document.querySelector('#compresion-rate');
  h3.textContent = `Compresión: ${rate.toFixed(2)*100}%`;
}
const chatForm = document.getElementById('chat-form'); //Acessando as mensagens da caixa de mensagens do chat através do formulário
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name'); //Importando o campo do formulário para adicionar as salas
const userList = document.getElementById('users');   //Importando o campo do formulário para adicionar os usuários do chAT

// Capturando o nome do usuário e a sala através da URL
const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io(); // Atualiza a cada nova conexão

socket.emit('joinRoom', { username, room}); // Se juntando ao chat

socket.on('roomUsers', ({ room, users }) => { //Capturando as salas e os usuários e enviando para a tela do chat através da manipulação do DOM
    outputRoomName(room);
    outputUsers(users)
});


socket.on('message', message => { // Recebendo a mensagem enviando pelo servidor
    outputMessage(message);  // Capturando as mensagens para a tela do chat através da manipulação do DOM

    // Rolando o scroll para baixo sempre que chegar uma nova mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


chatForm.addEventListener('submit', (e) => {   // Criando um evento para submissão das mensagens
    e.preventDefault();

   
    const msg = e.target.elements.msg.value; // Capturando a mensagem digitada na caixa de envio

    
    socket.emit('IFchatMessage', msg);  // Enviando a mensagem para o servidor

    // Limpando o campo da mensagem digitada apos envio
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



// Adicionando a saida da mensagem no DOM (tela do chat) - Manipulação do DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  
    document.querySelector('.chat-messages').appendChild(div);
}

// Adicionando o nome da sala ao DOM (tela do chat) - Manipulação do DOM
function outputRoomName(room) {
    roomName.innerText = room; // substituindo o nome da sala pelo valor passado
}

// Adicionando os usuários ao DOM (tela do chat) - Manipulação do DOM
function outputUsers(users) { // substituindo o nome do usuário pelo valor passado
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `; //convertendo um array em uma string
}
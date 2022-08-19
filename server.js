const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');  // Biblioteca para comunicação com o servidor 
const formatMessage = require('./utils/messages'); 
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/users');


const app = express();
const server = http.createServer(app);  // Criando um servidor http (escutando na porta 3000)
const io = socketio(server); // Estabelecendo a comunicação da nossa aplicação com o servidor node através do socket

// Configurando o acesso estático a pasta da pagina do chat
app.use(express.static(path.join(__dirname, 'public')));


// Inicializará sempre que o evento connection for executando, ou seja,sempre que um cliente se conectar atraves da pagina chat
const botName = 'IFChat Bot'; //Nome do bot moderador do chat

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room}) => {
        const user = userJoin(socket.id, username, room); // captura o id, o nome do usuario e a sala
       
        socket.join(user.room);
  
    socket.emit('message', formatMessage(botName, 'Seja bem vindo ao IFChat!'));
        
    socket.broadcast //Enviando mensagem em Broadcast quando um novo usuario se conectar (criação de socket com o servidor)
        .to(user.room)
        .emit('message', formatMessage(botName,`${user.username} entrou na sala.`)
        ); // broadcast uma sala especifica
    
        // Enviando as informações da sala e dos usuarios quando alguem se desconectar ( atualizando a barra lateral)
        io.to(user.room).emit('roomUsers', { 
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });
      
    socket.on('IFchatMessage', (msg) => {  // Esperando as mensagens do IFchat
        const user = getCurrentUser(socket.id);
        
        console.log(msg); //mostrando a mensagem do lado do servidor     
        io
        .to(user.room)
        .emit('message', formatMessage(user.username, msg)
        ); //enviando a mensagem do cliente para um chat especifico
    });

    
    socket.on('disconnect', () => { //Será acionado quando um usuário desconectar
        const user = userLeave(socket.id); //Qual usuario saiu?

        if(user) { //Se o usuario existe, a mensagem será mostrada com seu nome
            io
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} deixou o sala.`)
            );
            
            // Enviando as informações da sala e dos usuarios quando alguem se desconectar ( atualizando a barra lateral)
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
       
    });
});



// Testando a conexão com o servidor
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Servidor funcionando na porta ${PORT}`));

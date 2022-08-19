const users = [];  // array de usuarios


// Capturando os usuarios que estão entrando na sala
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user); // adicionando o usuario no array

    return user;
}


// Capturando o usuário atual pelo id
function getCurrentUser(id){
    return users.find(user => user.id === id); //procurando o usuario pelo id dentro do array
}

// Removendo o usuário quando ele sair do chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id); // procurando o usuário no array pelo id

    if(index !== -1){ // se o findIndex não encontrar retornará -1
        return users.splice(index, 1)[0]; //se encontrar retornará o usuário
    }
}

// Capturando os usuários da sala do chat
function getRoomUsers(room){
    return users.filter(user => user.room === room); // filtrará no array os usuarios que possuem o room igual ao passado
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
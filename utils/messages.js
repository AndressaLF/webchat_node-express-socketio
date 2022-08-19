const moment = require('moment'); 

// Transformando a mensagem em um objeto com atributos
function formatMessage(username, text){ 
    return{
        username, 
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage; //exportando para usar no servidor
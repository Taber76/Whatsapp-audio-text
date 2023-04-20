const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')
const audio2txt = require('../audio/whatsapp2txt')
const chatGpt = require('../chat/chatGpt')


const client = new Client()

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
})

client.on('ready', () => {
    console.log('Client is ready!')
})


client.on('message', async( msg ) => {
    let msgResp = 'No es un mensaje de audio o no se ha podido procesar'
    if (msg.type === 'ptt' || msg.type === 'audio') {
        try {
            const audioData = await msg.downloadMedia() // Obtener enlace de descarga del mensaje de voz
            const msgtxt = await audio2txt( audioData )
            msgResp = await chatGpt( msgtxt )
        } catch (err) {
            console.error('Error al procesar mensaje de audio:', err)
        } 
      }

    client.sendMessage(msg.from, msgResp) // cambiar el msg.from para enviar a otro numero
})

client.initialize()


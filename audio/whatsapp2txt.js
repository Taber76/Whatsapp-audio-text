const fs = require('fs')
const speech = require('@google-cloud/speech')
const googleAcount = require('../googleKeys.json')


const client = new speech.SpeechClient({
  projectId: googleAcount.project_id,
  credentials: {
    private_key: googleAcount.private_key,
    client_email: googleAcount.client_email
  }
})

const saveAudioFile = ( audioData ) => {
  const base64Data = audioData.data.replace(/^data:audio\/\w+;base64,/, '') // Eliminar la información de tipo de archivo del encabezado
  const buffer = Buffer.from(base64Data, 'base64') // Convertir el archivo base64 a un buffer
  fs.writeFileSync('audio.ogg', buffer);
}

const delAduioFile = () => {
  fs.unlink('audio.ogg')
  .then(() => {
    console.log('Archivo eliminado');
  })
  .catch(err => {
    console.error('Algo salió mal al eliminar el archivo', err)
  })
}


const audio2txt = async( audioData )=> {
  saveAudioFile( audioData )
  const file = fs.readFileSync('audio.ogg')

  // Configuración para la transcripción
  const config = {
    encoding: 'OGG_OPUS',
    sampleRateHertz: 16000,
    languageCode: 'es-UY',
  }
  const request = {
    audio: { content: file},
    config: config,
  }

  // Llamada a speech to text
  const [response] = await client.recognize(request)
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n')

  delAduioFile()

  return transcription
}



module.exports = audio2txt
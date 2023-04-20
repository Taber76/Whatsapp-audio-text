require('dotenv').config()
const {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  Configuration,
  OpenAIApi,
} = require('openai')



const configuration = new Configuration({
  apiKey: process.env.GPTAPIKEY,
})
const openai = new OpenAIApi(configuration)



const chatGpt = async( promptMsg ) => {

  let prompt = 'Resuma el siguiente mensaje que me han enviado en una o dos frases: '
  
  prompt = prompt + promptMsg

  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
    temperature: 0,
  }
  const completion = await openai.createChatCompletion(apiRequestBody)
  
  return completion.data.choices[0].message.content

}


module.exports = chatGpt

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require("dotenv").config();


const fs = require('fs');
const pdf = require('pdf-parse');

const filePath = 'modelo-atestado-2.pdf';

const prompt = "The following data is information from a medical certificate in a PDF.If possible, return a json containing the information: name, email, telephone. Otherwise return an empty json"

fs.readFile(filePath, async (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo PDF:', err);
        return;
    }

    const options = {};  // Você pode fornecer opções adicionais aqui, se necessário

    try {
        const pdfData = await pdf(data, options);
        //console.log(pdfData.text);
        await sendPrompt(prompt, pdfData.text);
    } catch (error) {
        console.error('Erro ao processar o arquivo PDF:', error);
    }
});


const sendPrompt = async (prompt, pdf) => {
    
    const client = new OpenAIClient(
        "https://" + process.env.RESOURCE_NAME + ".openai.azure.com/", 
        new AzureKeyCredential(process.env.AZURE_API_KEY)
    );
      
    try {
      const messages = [
        { role: "system", content: prompt  },
        { role: "user", content: pdf },
       
      ];
    
      const response = await client.getChatCompletions(process.env.DEPLOYMENT_ID, messages, { maxTokens: 128 });
      const parseResult = Object.assign({}, JSON.parse(response.choices[0].message.content));

      console.log("NOME: ", parseResult.name)
      console.log("EMAIL: ", parseResult.email)
      console.log("TELEFONE: ", parseResult.telephone)
      //console.log(response)
    } catch (error) {
      console.log(error)
    }
};

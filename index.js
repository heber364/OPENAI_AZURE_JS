const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require("dotenv").config();


const fs = require('fs');
const pdf = require('pdf-parse');

const filePath = 'modelo-atestado.pdf';

fs.readFile(filePath, async (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo PDF:', err);
        return;
    }

    const options = {};  // Você pode fornecer opções adicionais aqui, se necessário

    try {
        const pdfData = await pdf(data, options);
        //console.log(pdfData.text);
        await sendPrompt(pdfData.text);
    } catch (error) {
        console.error('Erro ao processar o arquivo PDF:', error);
    }
});


const sendPrompt = async (pdf) => {
    
    const client = new OpenAIClient(
        "https://" + process.env.RESOURCE_NAME + ".openai.azure.com/", 
        new AzureKeyCredential(process.env.AZURE_API_KEY)
    );
      
    try {
      const messages = [
        { role: "system", content: "What information does the following pdf file provide?" },
        { role: "user", content: pdf },
       
      ];
    
      const response = await client.getChatCompletions(process.env.DEPLOYMENT_ID, messages, { maxTokens: 128 });
      console.log(response.choices[0].message.content)
      //console.log(response)
    } catch (error) {
      console.log(error)
    }
};

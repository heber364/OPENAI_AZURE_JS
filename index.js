const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require("dotenv").config();

const sendPrompt = async () => {
    
    const client = new OpenAIClient(
        "https://" + process.env.RESOURCE_NAME + ".openai.azure.com/", 
        new AzureKeyCredential(process.env.AZURE_API_KEY)
    );
      
    try {
      const messages = [
        { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
        { role: "user", content: "Can you help me?" },
        { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
        { role: "user", content: "What's the best way to train a parrot?" },
      ];
    
      const response = await client.getChatCompletions(process.env.DEPLOYMENT_ID, messages, { maxTokens: 128 });
      console.log(response)
    } catch (error) {
      console.log(error)
    }
};

sendPrompt();
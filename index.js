const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require("dotenv").config();

const sendPrompt = async () => {
    
    const client = new OpenAIClient(
        "https://" + process.env.RESOURCE_NAME + ".openai.azure.com/", 
        new AzureKeyCredential(process.env.AZURE_API_KEY)
    );
      
    try {
      var prompt = "Hello, world!"
      const response = await client.getCompletions(process.env.DEPLOYMENT_ID, [prompt]);
      console.log(response)
    } catch (error) {
      console.log(error)
    }
};

sendPrompt();
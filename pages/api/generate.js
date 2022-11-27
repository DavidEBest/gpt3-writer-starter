import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Generate a detailed argument for the following expert opinion:`;
const generateAction = async(req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`);
    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.8,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();

    console.log("output", basePromptOutput.text);

    const secondPrompt = 
    `Take the opinion and argument below and generate a detailed and scholarly opposing argument from an expert.

    Opinion: ${req.body.userInput}
    
    Argument: ${basePromptOutput.text}
    `;

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `${secondPrompt}`,
        temperature: 0.85,
        max_tokens: 1000,
    });

    const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    res.status(200).json({argument: basePromptOutput, counter: secondPromptOutput});
};

export default generateAction;
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

// console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

// use for to allow us to make cross origin request.
app.use(cors());

// this is going to allow us to pass json frontend to the backend
app.use(express.json());


// with app.get route we can can receive a lot of data from frontend
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    })
});


// this app.post route allowes us to have a body/preload
// parameters:: 
// temperature: higher temperature value means the module will take more risk 
// max_tokens: maximum number of tokens allowed to generate in completion, lets take its value 3000 so it actually gives a some big responses.
// top_p: alternative to sampling with temperature, called nucleus sampling
// frequency_penalty: it not going to repeat similar sentences often,so we can set the value 0.5.Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
//  presence_penalty: Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });


        // once we get the response we have to send it back to the frontend 
        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
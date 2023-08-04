const express = require("express");
const rateLimit = require("express-rate-limit");
const { Configuration, OpenAIApi } = require("openai");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || "3002";
const key = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: key,
});

const openai = new OpenAIApi(configuration);


const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
});

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Express + OpenAI API Server");
});


app.post("/getlinks", limiter, async (req, res) => {
  try {
    const { tags } = req.body;


    const messages = tags.map((tag) => ({
      role: "user",
      content: tag,
    }));

   
    await delay(2000);

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",  model for the task
      prompt: messages.join("\n"),
      max_tokens: 100,
    });

    
    const links = getLinks(response.data.choices[0].text);
    res.json(links);
  } catch (error) {
    console.error("Error fetching links:", error.message);
    res.status(500).json({ error: "Failed to fetch links" });
  }
});


const getLinks = (text) => {
  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const links = text.match(regex) || [];
  return links;
};


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});

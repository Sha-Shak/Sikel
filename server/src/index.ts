import express, { Request, Response } from "express";
const { Configuration, OpenAIApi } = require("openai");

const app = express();

const dotenv = require("dotenv");

dotenv.config({path: './'});

const port = process.env.PORT || '3001';
const key =
  process.env.OPENAI_API_KEY ||
  "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";
console.log("key", key);

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const configuration = new Configuration({
  apiKey: key,
});

const openai = new OpenAIApi(configuration);

// Link extraction function
const getLinks = (text: string): string[] => {
  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const links: string[] = text.match(regex)!;
  return links;
};

app.get("/getlinks", async (_req: Request, res: Response) => {
  const tags = ["bicycle", "merida", "veloce"];

  const prompt = `Find me some YouTube videos and articles about ${tags.join(
    ", "
  )}.`;

  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt,
    max_tokens: 100,
  });

  const links = getLinks(response.data.choices[0].text);
  res.json(links);
});

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});

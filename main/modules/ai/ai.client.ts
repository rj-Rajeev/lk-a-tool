import OpenAI from "openai";

export const aiClient = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.OPENROUTER_API_KEY!,
});
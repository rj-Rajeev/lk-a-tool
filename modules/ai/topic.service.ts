import { aiClient } from "./ai.client";
import { buildLinkedInTopicsPrompt } from "./topic.prompt";

function parseTopics(content: string): string[] {
  return content
    .split("\n")
    .map(t => t.replace(/^\d+[\).\s-]*/, "").trim())
    .filter(Boolean);
}

export async function generateLinkedInTopics(config: any) {
  const prompt = buildLinkedInTopicsPrompt(config);

  const response = await aiClient.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: "Provide only the topics list.",
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "";
  return parseTopics(content);
}

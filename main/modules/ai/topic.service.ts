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
  
// console.log('-----------------------\n',prompt);

  const response = await aiClient.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: "Provide only the topics list.",
      },
    ],
  });

// console.log('--------------------------',response);


  const content = response.choices[0]?.message?.content ?? "";
  return parseTopics(content);
}

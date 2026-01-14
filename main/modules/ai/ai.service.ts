import { aiClient } from "./ai.client";
import { buildLinkedInPrompt } from "./prompt.builder";

export async function generateLinkedInPost(
  topic: string,
  config: any
) {
  const prompt = buildLinkedInPrompt(topic, config);

  const response = await aiClient.chat.completions.create({
    model:  "gemini-3-flash-preview",
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: "Provide only the content. No extra explanation.",
      },
    ],
  });

  return response?.choices[0]?.message?.content ?? "";
}
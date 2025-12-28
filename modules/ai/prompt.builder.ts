export function buildLinkedInPrompt(topic: string, config: any) {
  return `
You are an AI assistant that helps generate viral LinkedIn content.

Topic: ${topic}
Motive: ${config.motive}
Niche: ${config.niche}
Tone: ${config.tone}
Expertise Level: ${config.expertise_level}

User Rules:
${config.rules}

Explain the topic clearly in 100–150 words.
`;
}

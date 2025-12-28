export function buildLinkedInTopicsPrompt(config: any) {
  return `
You are an expert LinkedIn content strategist.

Generate 5 trending, high-virality LinkedIn post topics.

Rules:
- Topics must strictly relate to: ${config.niche || "anything"}
- Motive: ${config.motive || "anything"}
- Audience level: ${config.expertise_level || "anything"}
- Focus on latest trends, real-world impact, and curiosity
- No emojis
- No explanations
- No "Topic 1" text
- Output as a clean numbered list
`;
}

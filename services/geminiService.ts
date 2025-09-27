import { GoogleGenAI, Type } from "@google/genai";
import { Language, LearningPath, Difficulty, LessonContent } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model: string = 'gemini-2.5-flash';

export const geminiService = {
  async generateAiVsHumanContentBatch(language: Language, difficulty: Difficulty): Promise<Array<{ text: string; isAi: boolean }>> {
      const difficultyInstruction = difficulty === 'Easy' 
        ? `
        - For objects where "isAi" is true, create a NEW, wise-sounding proverb about modern technology or the internet. It should be fairly obvious it's modern.
        - For objects where "isAi" is false, provide a very common, well-known, AUTHENTIC proverb from that culture.
        `
        : `
        - For objects where "isAi" is true, create a NEW, subtle, and philosophical proverb about technology that sounds authentic and could be mistaken for a traditional one.
        - For objects where "isAi" is false, provide a more obscure or less common, but still AUTHENTIC proverb from that culture.
        `;

      const prompt = `
        You are an expert in proverbs from ${language}-speaking cultures.
        Your task is to generate a JSON array containing 5 proverb objects.
        The difficulty level is ${difficulty}.

        Each object in the array must have two keys: "text" (the proverb in ${language}) and "isAi" (a boolean).

        ${difficultyInstruction}

        The final array should contain a random mix of AI-generated and authentic proverbs.

        Respond with ONLY a valid JSON array. Do not add any explanation or markdown formatting like \`\`\`json.
      `;

      try {
          const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            isAi: { type: Type.BOOLEAN },
                        },
                        required: ["text", "isAi"],
                    },
                },
            },
          });
          const jsonText = response.text.trim();
          return JSON.parse(jsonText);
      } catch (error) {
          console.error("Error generating AI vs Human content:", error);
          // Fallback to a hardcoded list of proverbs
          return [
            { text: "A journey of a thousand miles begins with a single step.", isAi: false },
            { text: "A slow internet connection tests a person's patience more than any master.", isAi: true },
            { text: "The same water that softens the yam can harden the egg.", isAi: false },
            { text: "A wise man stores his knowledge in the cloud.", isAi: true },
            { text: "He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.", isAi: false },
          ];
      }
  },

  async generateImageForLesson(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image generated");
        }
    } catch (error) {
        console.error("Error generating image for lesson:", error);
        throw error;
    }
  },

  async generateDynamicLessonContent(englishContent: Omit<LessonContent, 'quiz' | 'title'>, language: Language): Promise<Omit<LessonContent, 'quiz' | 'title'>> {
    const prompt = `
      You are an expert curriculum developer specializing in AI literacy for diverse audiences.
      Your task is to rewrite the following lesson content for a learner who speaks ${language}.
      The goal is to make the content more engaging, culturally relevant, and easier to understand.

      - Use simpler language and sentence structures.
      - Where appropriate, use analogies or examples that would resonate in a ${language}-speaking region.
      - Maintain the core educational message of each section.
      - The response must be in ${language}.
      - For any technical AI terms that do not have a direct translation, keep the English term but briefly explain its meaning in ${language} using a simple analogy.
      
      Original English Content:
      Introduction: "${englishContent.introduction}"
      Sections:
      ${englishContent.sections.map(s => `- ${s.heading}: ${s.content}`).join('\n')}
      Summary: "${englishContent.summary}"

      Respond ONLY with a valid JSON object. Do not include any other text or markdown formatting.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              introduction: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    content: { type: Type.STRING },
                  },
                  required: ["heading", "content"],
                },
              },
              summary: { type: Type.STRING },
            },
            required: ["introduction", "sections", "summary"],
          },
        },
      });
      const jsonText = response.text.trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Error generating dynamic lesson content:", error);
      // Re-throw the error to allow the component to handle the fallback.
      throw error;
    }
  },
};

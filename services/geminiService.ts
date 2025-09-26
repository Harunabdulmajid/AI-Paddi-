import { GoogleGenAI, Type } from "@google/genai";
import { Language, LearningPath } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

interface OnboardingResponse {
  level: LearningPath;
  explanation: string;
}

export const geminiService = {
  async evaluateOnboardingAnswer(question: string, answer: string, language: Language): Promise<OnboardingResponse> {
    const prompt = `
      A user is being onboarded to an AI literacy app. They are from a region where ${language} is spoken.
      Their task was to answer the following question: "${question}"
      Their answer is: "${answer}"

      Your task is to:
      1. Analyze their answer to gauge their understanding of AI.
      2. Classify their understanding into one of three levels: "Beginner", "Intermediate", or "Advanced".
      3. Write a short, encouraging, and culturally relevant explanation for them in ${language}.
         - If they are correct, praise them and use a local analogy (like a recipe for an algorithm).
         - If they are partially correct, gently guide them.
         - If they are incorrect, provide a simple, non-technical correction.
         - For any technical AI terms that do not have a direct translation, keep the English term but briefly explain its meaning in ${language} using a simple analogy.
      
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
              level: { 
                type: Type.STRING,
                enum: [LearningPath.Beginner, LearningPath.Intermediate, LearningPath.Advanced]
              },
              explanation: { type: Type.STRING },
            },
            required: ["level", "explanation"],
          },
        },
      });
      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as OnboardingResponse;
    } catch (error) {
      console.error("Error evaluating onboarding answer:", error);
      return {
        level: LearningPath.Beginner,
        explanation: "Sorry, I had a little trouble understanding. Let's start with the basics together!",
      };
    }
  },

  async generatePodcastScript(topic: string, language: Language): Promise<string> {
    const prompt = `
      Generate a script for a 2-minute educational podcast about "${topic}".
      The target audience is new to technology.
      The language must be ${language}.
      The script should be a friendly, conversational dialogue between two hosts: a male host named Haruna and a female host named Fatima.

      **Formatting Instructions:**
      - Use 'Haruna:' and 'Fatima:' as speaker labels.
      - Indicate sound effects or music cues in parentheses (e.g., "(Upbeat intro music fades in)").
      - Keep paragraphs short and easy to read.

      **Content Instructions:**
      - The tone should be conversational and encouraging.
      - Use simple terms and at least one local proverb or analogy relevant to a ${language}-speaking culture to explain the concept.
      - For any technical AI terms that do not have a direct translation (like 'algorithm' or 'neural network'), keep the English term but briefly explain its meaning in ${language} using a simple analogy.
      - Start with a friendly greeting and end with a thought-provoking question.
      
      Respond with ONLY the script text.
    `;
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error("Error generating podcast script:", error);
      return "I'm sorry, I couldn't create a script right now. Please try again later.";
    }
  },

  async generateAiVsHumanContent(language: Language): Promise<{ text: string; isAi: boolean }> {
      const isAi = Math.random() > 0.5;
      const topic = isAi ? "a short, wise-sounding proverb about technology" : "a well-known, authentic proverb";

      const prompt = `
        You are an expert in proverbs from ${language}-speaking cultures.
        Your task is to provide a single proverb based on the following instruction:
        Instruction: "${topic}".
        The proverb must be in ${language}.

        If the instruction is to create a NEW proverb about technology, make it sound authentic and wise, but it must be original. If you need to use a technical term without a direct translation, keep the English term.
        If the instruction is to provide an AUTHENTIC proverb, choose a real, common proverb from that culture.

        Respond with ONLY the proverb text in ${language}. Do not add any explanation or quotation marks.
      `;

      try {
          const response = await ai.models.generateContent({
              model,
              contents: prompt
          });
          return { text: response.text.trim(), isAi };
      } catch (error) {
          console.error("Error generating AI vs Human content:", error);
          // Fallback to a simple English proverb
          return { text: "A journey of a thousand miles begins with a single step.", isAi: false };
      }
  },
};
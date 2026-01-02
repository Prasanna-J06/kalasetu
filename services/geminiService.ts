
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GroundingSource } from "../types";

// Helper to get fresh instance for each call as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface ParsedProduct {
  name: string;
  category: string;
  price: number;
  description: string;
  story: string;
  sources: GroundingSource[];
}

/**
 * Transcribes audio and parses it into product details in one step
 * using the native audio capabilities of Gemini 2.5 Flash.
 */
export const parseAudioListing = async (
  audioBase64: string,
  imageBase64?: string
): Promise<ParsedProduct> => {
  const ai = getAI();
  const model = 'gemini-2.5-flash-native-audio-preview-09-2025';

  const audioPart = {
    inlineData: {
      data: audioBase64,
      mimeType: 'audio/wav',
    },
  };

  const textPart = {
    text: `Listen to this artisan describing their craft. 
    1. Extract the product name, category, and price. 
    2. Write a professional description. 
    3. Research the cultural significance using Google Search and write a 60-word story.
    Return only valid JSON.`
  };

  const parts = [audioPart, textPart];
  if (imageBase64) {
    parts.push({
      inlineData: {
        data: imageBase64.split(',')[1],
        mimeType: 'image/jpeg'
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          price: { type: Type.NUMBER },
          description: { type: Type.STRING },
          story: { type: Type.STRING },
        },
        required: ["name", "category", "price", "description", "story"]
      }
    }
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: GroundingSource[] = chunks
    .filter((c: any) => c.web)
    .map((c: any) => ({
      title: c.web.title || "Reference",
      uri: c.web.uri
    }));

  const parsed = JSON.parse(response.text || '{}');
  return { ...parsed, sources };
};

export const generateProductImage = async (name: string, story: string, category: string): Promise<string> => {
  const ai = getAI();
  const prompt = `A professional high-quality studio product photograph of a ${name}. 
  Context: This is a ${category} item. Cultural background: ${story}. 
  Style: Clean lighting, minimalist aesthetic, showing fine craft details, 4k resolution, high-end marketplace style.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image generated");
};

export const getAIAssistantResponse = async (query: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are KalaSetu's helpful assistant for local artisans. Use Google Search to provide accurate info. Query: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You guide artisans through selling their crafts. Speak simply."
    }
  });
  return response.text || "I'm sorry, can you repeat that?";
};

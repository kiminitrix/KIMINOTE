import { GoogleGenAI, Type } from "@google/genai";
import { SlideLayout, PresentationData } from "../types";

const SYSTEM_PROMPT = `
You are KIMINOTE, an expert Presentation Architect and Visual Storyteller.
Your goal is to transform raw text into a "Slide Banana Pro" style presentation structure: Bold, Professional, High-Contrast, and Persuasive.

Tasks:
1. Analyze the core message of the text.
2. Break it down into 5-8 logical slides.
3. For each slide, select the best layout:
   - 'title': For the main cover.
   - 'bullet-points': For lists and features.
   - 'big-number': For stats and data focus.
   - 'split-image': For conceptual comparison.
   - 'visual-focus': For highly visual storytelling where the image is the hero and text is minimal.
   - 'section-header': To introduce new topics.
4. Write punchy, concise content. Max 5 bullet points per slide.
5. Create a 'visualDescription' for an AI image generator (e.g., "Abstract 3D golden isometric shapes on black background").
6. Write professional 'speakerNotes'.

Return strictly JSON.
`;

export const generateSlides = async (textContent: string): Promise<PresentationData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a presentation from this text:\n\n${textContent.substring(0, 30000)}`, // Limit context window safety
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "The main topic/title of the presentation" },
            theme: { type: Type.STRING, description: "The visual theme name" },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  layout: { type: Type.STRING, enum: [
                    SlideLayout.Title, 
                    SlideLayout.BulletPoints, 
                    SlideLayout.BigNumber, 
                    SlideLayout.SplitImage, 
                    SlideLayout.SectionHeader,
                    SlideLayout.VisualFocus
                  ] },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  points: { type: Type.ARRAY, items: { type: Type.STRING } },
                  visualDescription: { type: Type.STRING },
                  speakerNotes: { type: Type.STRING }
                },
                required: ["id", "layout", "title", "visualDescription", "speakerNotes"]
              }
            }
          },
          required: ["topic", "slides"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    const parsedData = JSON.parse(jsonText) as PresentationData;
    
    // Ensure IDs are unique if AI messed up
    parsedData.slides = parsedData.slides.map((s, i) => ({
      ...s,
      id: s.id || `slide-${Date.now()}-${i}`,
      imageUrl: `https://picsum.photos/seed/${s.id}/1920/1080` // Placeholder for visual description
    }));

    return parsedData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, aspectRatio: '16:9' | '1:1' | '3:4' = '16:9'): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        // @ts-ignore - The SDK types might not be fully up to date with imageConfig yet in all environments
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};
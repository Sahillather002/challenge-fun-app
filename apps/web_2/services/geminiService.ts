
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { ChatSettings, Message } from "../types";

// Always initialize a new GoogleGenAI instance right before an API call 
// to ensure we use the most up-to-date API key from the context.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const getCurrentLocation = (): Promise<{latitude: number, longitude: number} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    );
  });
};

export const createChatStream = async (
  settings: ChatSettings & { useSearch?: boolean },
  history: Message[],
  onChunk: (text: string, grounding?: any) => void
) => {
  const ai = getAI();
  
  // Rule: Maps grounding is only supported in Gemini 2.5 series.
  // Rule: Search grounding is supported in Gemini 3.
  const modelId = settings.useMaps 
    ? 'gemini-2.5-flash' 
    : (settings.useSearch ? 'gemini-3-flash-preview' : settings.model);
  
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const config: any = {
    systemInstruction: settings.systemPrompt,
    temperature: settings.temperature,
    maxOutputTokens: settings.maxTokens,
    topP: settings.topP,
  };

  // Rule: Use thinkingConfig for complex reasoning in Gemini 3 Pro.
  if (modelId.includes('pro')) {
    config.thinkingConfig = { thinkingBudget: 4096 };
  }

  if (settings.useMaps) {
    config.tools = [{ googleMaps: {} }];
    const location = await getCurrentLocation();
    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: location
        }
      };
    }
  } else if (settings.useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const streamResponse = await ai.models.generateContentStream({
      model: modelId,
      contents: contents,
      config: config
    });

    let fullText = "";
    let lastGrounding = undefined;
    
    for await (const chunk of streamResponse) {
      const c = chunk as GenerateContentResponse;
      fullText += c.text || "";
      if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        lastGrounding = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
      }
      onChunk(fullText, lastGrounding);
    }
    return fullText;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAI();
  
  // Rule: High-quality image generation (2K/4K) requires user-selected API key.
  if (size !== '1K' && typeof (window as any).aistudio !== 'undefined') {
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Image edit failed.");
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

export const generateVideo = async (base64Image: string, prompt: string, aspectRatio: '16:9' | '9:16') => {
  const ai = getAI();
  
  // Rule: Veo models MUST have a user-selected API key.
  if (typeof (window as any).aistudio !== 'undefined') {
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
    }
  }

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: base64Image.split(',')[1],
        mimeType: 'image/png'
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await videoRes.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt || "Analyze this image and provide a detailed breakdown." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return response.text || "Analysis complete but no text generated.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};

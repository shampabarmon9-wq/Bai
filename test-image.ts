import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const interaction = await ai.interactions.create({
      model: 'gemini-3.1-flash-image',
      input: "A robot holding a red skateboard.",
      response_modalities: ['image'],
      generation_config: {
        image_config: { aspect_ratio: "1:1", image_size: "1K" }
      },
    });
    console.log('Success:', interaction.steps.length);
  } catch (error) {
    console.error('Error:', error);
  }
}
test();

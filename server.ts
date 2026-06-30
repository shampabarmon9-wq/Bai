import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to handle chat messages
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, credits } = req.body;
      
      if (!credits || credits <= 0) {
         res.status(403).json({ error: 'Insufficient credits. Please recharge.' });
         return;
      }

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Invalid messages format' });
        return;
      }

      const formattedHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Stream the response from Gemini
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: formattedHistory,
        config: {
          systemInstruction: 'You are a professional AI assistant. You can answer questions, write code, and solve problems effectively.',
        }
      });

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      
      res.end();
    } catch (error) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  // API Route to handle image generation
  app.post('/api/generate-image', async (req, res) => {
    try {
      console.log('Received generate-image request', req.body);
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      console.log('Calling Gemini AI for image...');
      const interaction = await ai.interactions.create({
        model: 'gemini-3.1-flash-image',
        input: prompt,
        response_modalities: ['image'],
        generation_config: {
          image_config: { aspect_ratio: "1:1", image_size: "1K" }
        },
      });

      console.log('Gemini AI call successful, steps:', interaction.steps?.length);
      let imageUrl = null;
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const imageContent = step.content?.find(c => c.type === 'image');
          if (imageContent && imageContent.data) {
            imageUrl = `data:${imageContent.mime_type || 'image/png'};base64,${imageContent.data}`;
          }
        }
      }

      if (imageUrl) {
        res.json({ imageUrl });
      } else {
        res.status(500).json({ error: 'Failed to generate image' });
      }
    } catch (error) {
      console.error('Image API Error caught in catch block');
      // Fallback to pollinations AI for free tier quota limits
      try {
         const fallbackPrompt = req.body?.prompt || 'A beautiful image';
         const encodedPrompt = encodeURIComponent(fallbackPrompt);
         res.json({ imageUrl: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true` });
      } catch (err) {
         res.status(500).json({ error: 'Fallback failed' });
      }
    }
  });

  // API Route to handle video generation (Mocking response due to complexity/time limits for Veo)
  app.post('/api/generate-video', async (req, res) => {
    try {
      console.log('Received generate-video request', req.body);
      // Return a beautiful placeholder video URL for UI since Veo requires polling and takes several minutes
      setTimeout(() => {
        res.json({ videoUrl: "https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4" });
      }, 3000);
    } catch (error) {
      console.error('Video API Error caught');
      res.status(500).json({ error: 'Failed to generate video' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

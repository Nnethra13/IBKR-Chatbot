import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return String(value).trim();
}

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = requireEnv('CHATBOT_API_KEY');

    const message =
      typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const upstream = await fetch('https://chat.illinois.edu/api/chat-api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3:32b',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Follow instructions carefully. Respond using markdown.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        api_key: apiKey,
        course_name: 'IBKR-chatbot',
        stream: false,
        temperature: 0.1,
        retrieval_only: false,
      }),
    });

    const rawText = await upstream.text();
    console.log('UPSTREAM STATUS =', upstream.status);
    console.log('UPSTREAM TEXT =', rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: 'Upstream error',
        details: data,
      });
    }

    const text =
      data?.choices?.[0]?.message?.content ||
      data?.message ||
      data?.response ||
      '';

    if (!text || typeof text !== 'string') {
      return res.status(502).json({
        error: 'No assistant message returned',
        details: data,
      });
    }

    return res.json({ reply: text.trim() });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Server error',
    });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
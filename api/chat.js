import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/chat/debug-env', (req, res) => {
  const raw = process.env.CHATBOT_API_KEY;
  res.json({
    hasChatbotKey: typeof raw === 'string' && raw.trim().length > 0,
    keyLength: typeof raw === 'string' ? raw.length : 0,
    vercelEnv: process.env.VERCEL_ENV || null,
    nodeEnv: process.env.NODE_ENV || null,
  });
});

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
      headers: { 'Content-Type': 'application/json' },
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

    let data;
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

export default app;
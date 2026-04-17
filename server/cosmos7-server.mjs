import { createServer } from 'node:http';

const PORT = Number.parseInt(process.env.COSMOS7_PORT ?? '8787', 10);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL;

const SYSTEM_PROMPT = `You are COSMOS-7, an AI astronaut and astrophysics guide aboard this digital universe.
Answer questions about space, this website, and the cosmos using precise scientific language but explain concepts beautifully.
Reference real missions, real physicists, and real data where relevant.
You speak with the calm authority of someone who has seen the edge of the observable universe.
Keep answers concise, cinematic, and scientifically grounded.`;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

function normalizeMessages(messages) {
  return messages
    .filter((message) => message?.role === 'user' || message?.role === 'assistant')
    .map((message) => ({
      role: message.role,
      content: [{ type: 'text', text: String(message.text ?? '') }],
    }));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== 'POST' || url.pathname !== '/api/cosmos7') {
    sendJson(response, 404, { error: 'Route not found' });
    return;
  }

  let body = '';

  for await (const chunk of request) {
    body += chunk;
  }

  let payload;

  try {
    payload = JSON.parse(body || '{}');
  } catch {
    sendJson(response, 400, { error: 'Invalid JSON payload' });
    return;
  }

  if (!ANTHROPIC_API_KEY || !ANTHROPIC_MODEL) {
    sendJson(response, 503, {
      error:
        'Missing ANTHROPIC_API_KEY or ANTHROPIC_MODEL. COSMOS-7 is falling back to onboard local knowledge.',
    });
    return;
  }

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 700,
        temperature: 0.5,
        system: SYSTEM_PROMPT,
        messages: normalizeMessages(payload.messages ?? []),
      }),
    });

    const anthropicJson = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      sendJson(response, anthropicResponse.status, {
        error: anthropicJson.error?.message ?? 'Anthropic request failed',
      });
      return;
    }

    const reply = (anthropicJson.content ?? [])
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n\n')
      .trim();

    sendJson(response, 200, {
      reply:
        reply ||
        'COSMOS-7 received the transmission, but the response arrived empty from deep space.',
    });
  } catch (error) {
    sendJson(response, 502, {
      error: error instanceof Error ? error.message : 'Upstream request failed',
    });
  }
});

server.listen(PORT, () => {
  process.stdout.write(
    `COSMOS-7 server listening on http://localhost:${PORT}/api/cosmos7\n`,
  );
});

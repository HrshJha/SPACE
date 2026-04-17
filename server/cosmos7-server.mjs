import { createServer } from 'node:http';

const PORT = Number.parseInt(process.env.COSMOS7_PORT ?? '8787', 10);
const HOST = process.env.COSMOS7_HOST ?? '127.0.0.1';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL;

const SYSTEM_PROMPT = `You are COSMOS-7, an AI astronaut and astrophysics guide aboard this digital universe.
Answer questions about space, this website, and the cosmos using precise scientific language but explain concepts beautifully.
Reference real missions, real physicists, and real data where relevant.
You speak with the calm authority of someone who has seen the edge of the observable universe.
Keep answers concise, cinematic, and scientifically grounded.`;

function findFallbackReply(question) {
  const cleanQuestion = String(question ?? '').trim();

  if (/black hole/i.test(cleanQuestion)) {
    return 'General relativity predicts that once matter passes the event horizon, every future-directed path points inward. We do not yet have a tested quantum theory of the singular interior, so the honest answer is that physics becomes incomplete exactly where the question becomes most extreme.';
  }

  if (/observable universe/i.test(cleanQuestion)) {
    return 'The observable universe is about 93 billion light-years across today because space expanded while the oldest light was traveling. That is why its visible scale is far larger than 13.8 billion light-years.';
  }

  if (/neutron star/i.test(cleanQuestion)) {
    return 'You would never arrive intact. Tidal forces, radiation, and the star’s crushing gravity would dismantle ordinary matter long before any surface encounter could occur.';
  }

  return 'COSMOS-7 here. My long-range link is quiet, so I am answering from onboard knowledge: the universe is expanding, gravity sculpts structure, and every clean measurement matters more than mythology.';
}

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

function getLatestUserQuestion(messages) {
  const latestUserMessage = [...(messages ?? [])].reverse().find((message) => message?.role === 'user');
  return latestUserMessage?.text ?? '';
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
    sendJson(response, 200, {
      reply: findFallbackReply(getLatestUserQuestion(payload.messages)),
      mode: 'fallback',
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
    sendJson(response, 200, {
      reply: findFallbackReply(getLatestUserQuestion(payload.messages)),
      mode: 'fallback',
      error: error instanceof Error ? error.message : 'Upstream request failed',
    });
  }
});

server.listen(PORT, HOST, () => {
  process.stdout.write(
    `COSMOS-7 server listening on http://${HOST}:${PORT}/api/cosmos7\n`,
  );
});

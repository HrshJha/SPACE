import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cosmosFallbackAnswers, cosmosPrompts } from '../../utils/spaceData.js';
import { useCosmosStore } from '../../store/useCosmosStore.js';

function findFallback(question) {
  const hit = cosmosFallbackAnswers.find(({ match }) => match.test(question));
  return (
    hit?.answer ??
    'COSMOS-7 here. My long-range link is quiet, so I am answering from local onboard knowledge: the universe is expanding, gravity sculpts structure, and every clean measurement matters more than mythology.'
  );
}

export function AstroBot() {
  const chatbotOpen = useCosmosStore((state) => state.chatbotOpen);
  const setChatbotOpen = useCosmosStore((state) => state.setChatbotOpen);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'COSMOS-7 online. Ask about black holes, stellar evolution, missions, or the machinery of this universe.',
    },
  ]);
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const endpoint = import.meta.env.VITE_COSMOS7_ENDPOINT;
  const suggested = useMemo(() => cosmosPrompts, []);

  const streamReply = (text) => {
    setMessages((current) => [...current, { role: 'assistant', text: '' }]);
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setMessages((current) => {
        const next = [...current];
        next[next.length - 1] = {
          role: 'assistant',
          text: text.slice(0, index),
        };
        return next;
      });

      if (index >= text.length) {
        window.clearInterval(interval);
        setSending(false);
      }
    }, 18);
  };

  const sendMessage = async (question) => {
    if (!question.trim() || sending) {
      return;
    }

    const cleanQuestion = question.trim();
    const outgoingMessages = [...messages, { role: 'user', text: cleanQuestion }];
    setValue('');
    setSending(true);
    setMessages(outgoingMessages);

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: outgoingMessages }),
        });

        if (!response.ok) {
          throw new Error('Remote COSMOS-7 unavailable');
        }

        const payload = await response.json();
        streamReply(payload.reply ?? findFallback(cleanQuestion));
        return;
      }

      streamReply(findFallback(cleanQuestion));
    } catch {
      streamReply(findFallback(cleanQuestion));
    }
  };

  return (
    <div id="cosmos-7" className="fixed bottom-6 right-6 z-[65]">
      <button
        type="button"
        onClick={() => setChatbotOpen(true)}
        className="group flex items-center gap-3 rounded-full border border-white/10 bg-black/[0.45] px-4 py-3 backdrop-blur-xl"
        aria-label="Open COSMOS-7 astrophysics assistant"
      >
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-nebula-blue/30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),rgba(74,158,255,0.18),rgba(0,0,0,0.9))]">
          <span className="absolute inset-1 rounded-full border border-white/20" />
          <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
        </span>
        <div className="hidden text-left md:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/[0.45]">
            AI Astronaut
          </p>
          <p className="font-display text-sm font-bold text-white">
            COSMOS-7
          </p>
        </div>
      </button>
      <AnimatePresence>
        {chatbotOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="absolute bottom-20 right-0 w-[min(92vw,26rem)] overflow-hidden rounded-[30px] border border-white/10 bg-black/75 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-nebula-blue">
                  Deep Space Channel
                </p>
                <h3 className="font-display text-xl font-bold text-white">COSMOS-7</h3>
              </div>
              <button
                type="button"
                onClick={() => setChatbotOpen(false)}
                className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-white/70"
                aria-label="Close COSMOS-7 assistant"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                {suggested.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-white/10 px-3 py-2 text-left text-xs text-white/70 transition hover:border-nebula-blue/30 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-2xl p-4 text-sm ${
                      message.role === 'assistant'
                        ? 'border border-white/10 bg-white/5 text-white/[0.84]'
                        : 'ml-auto max-w-[90%] bg-nebula-blue/20 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(value);
                }}
                className="space-y-3"
              >
                <textarea
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-nebula-blue/40"
                  placeholder="Ask about astrophysics, missions, or the machinery of this universe..."
                  aria-label="Message COSMOS-7"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full border border-nebula-blue/30 bg-nebula-blue/[0.18] px-4 py-3 font-mono text-xs uppercase tracking-[0.28em] text-white transition hover:bg-nebula-blue/[0.26] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? 'Transmitting...' : 'Transmit Question'}
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default AstroBot;

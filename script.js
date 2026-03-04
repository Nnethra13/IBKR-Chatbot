const chatBody = document.getElementById('chat-body');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

const cannedReplies = [
  "In the full competition build, this is where you'd plug into real market data or a backtesting engine.",
  'Think about how you want to handle risk (position sizing, stop losses) before suggesting trades.',
  'You could design flows for: idea discovery, risk checks, and post-trade review.',
  'Great question. For the competition, focus on clarity and explainability when the bot suggests anything.',
];

function appendMessage(text, role = 'bot') {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  const p = document.createElement('p');
  p.textContent = text;
  bubble.appendChild(p);

  const ts = document.createElement('span');
  ts.className = 'timestamp';
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  ts.textContent = `Today • ${hh}:${mm}`;
  bubble.appendChild(ts);

  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getReply(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes('rule') || lower.includes('competition')) {
    return 'For competition specifics, you’ll have an official rulebook. This demo is focused on the chatbot UX and flow design.';
  }
  if (lower.includes('risk') || lower.includes('drawdown')) {
    return 'You might implement risk checks like max drawdown, per-trade risk, and exposure by asset class. How would your bot surface those?';
  }
  if (lower.includes('ticker') || lower.includes('stock') || lower.includes('etf')) {
    return 'In a full version, I would fetch price, basic fundamentals, and relevant risk notes for that ticker from your data source.';
  }
  if (lower.includes('start') || lower.includes('get started')) {
    return 'A good first step: map a sample user journey, like a student exploring a new strategy, then design the conversation around that.';
  }

  return cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
}

if (chatForm && chatInput) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    setTimeout(() => {
      appendMessage(getReply(text), 'bot');
    }, 450);
  });
}


// ── CHAT PANEL OPEN / CLOSE ──
const panel = document.getElementById('chat-panel');
const overlay = document.getElementById('chat-overlay');
const msgs = document.getElementById('chat-messages');
const input = document.getElementById('chat-input');

function openChat() {
  panel.classList.add('open');
  overlay.classList.add('open');
}

function closeChat() {
  panel.classList.remove('open');
  overlay.classList.remove('open');
}

document.getElementById('open-chat').addEventListener('click', openChat);
document.getElementById('open-chat-hero').addEventListener('click', openChat);
document.getElementById('close-chat').addEventListener('click', closeChat);
overlay.addEventListener('click', closeChat);

// ── CHIP SUGGESTIONS ──
document.querySelectorAll('.chip').forEach(c => {
  c.addEventListener('click', () => {
    openChat();
    sendMessage(c.dataset.q);
  });
});

// ── MESSAGE HELPERS ──
function appendMessage(text, role = 'bot') {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;

  const content = document.createElement('div');
  if (role === 'bot') {
    content.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text;
  } else {
    content.textContent = text;
  }
  bubble.appendChild(content);

  const ts = document.createElement('span');
  ts.className = 'timestamp';
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  ts.textContent = `Today • ${hh}:${mm}`;
  bubble.appendChild(ts);

  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  bubble.id = 'typing-bubble';
  bubble.innerHTML = `
    <div class="thinking-row">
      <span class="thinking-text">Thinking</span>
      <span class="typing-dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `;
  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-bubble');
  if (el) el.remove();
}

// ── API CALL ──
async function fetchBotReply(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = data?.details ? `\n\n${JSON.stringify(data.details, null, 2)}` : '';
    throw new Error((data?.error || 'Request failed') + details);
  }
  return data?.reply || 'Sorry — I did not get a response.';
}

// ── SEND ──
async function sendMessage(text) {
  if (!text || !text.trim()) return;
  appendMessage(text, 'user');
  input.value = '';
  input.disabled = true;
  showTypingIndicator();

  try {
    const reply = await fetchBotReply(text);
    removeTypingIndicator();
    appendMessage(reply, 'bot');
  } catch (err) {
    removeTypingIndicator();
    appendMessage(
      `Couldn't reach the chatbot server.\n\n${err instanceof Error ? err.message : 'Unknown error'}`,
      'bot'
    );
  } finally {
    input.disabled = false;
    input.focus();
  }
}

// Expose for any inline usage
window.handleChatMessage = (text, cb) => {
  fetchBotReply(text).then(cb).catch(() => cb('Sorry, something went wrong.'));
};

document.getElementById('chat-send').addEventListener('click', () => sendMessage(input.value));
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage(input.value);
});

// ── WELCOME MESSAGE ──

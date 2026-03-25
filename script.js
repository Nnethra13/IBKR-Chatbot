const chatBody = document.getElementById('chat-body');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function appendMessage(text, role = 'bot') {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  // const p = document.createElement('p');
  // p.textContent = text;
  // bubble.appendChild(p);

  const p = document.createElement('div');
  if (role === 'bot') {
    p.innerHTML = marked.parse(text);
  } else {
    p.textContent = text;
  }
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

if (chatForm && chatInput) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    void (async () => {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage(text, 'user');
      chatInput.value = '';

      const previousDisabled = chatInput.disabled;
      chatInput.disabled = true;

      try {
        const reply = await fetchBotReply(text);
        appendMessage(reply, 'bot');
      } catch (err) {
        appendMessage(
          `Couldn’t reach the chatbot server.\n\n${err instanceof Error ? err.message : 'Unknown error'}`,
          'bot',
        );
      } finally {
        chatInput.disabled = previousDisabled;
        chatInput.focus();
      }
    })();
  });
}

// Initial welcome message from the chatbot
if (chatBody) {
  appendMessage(
    "Hi! I am here to help with the IBKR competition. Ask me anything about the rules, timeline, deliverables, or logistics, and I will point you to the relevant info! If something isn’t covered in our materials, I will direct you in the right direction!",
    'bot',
  );
}


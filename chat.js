/* ================================================================
   CHOSENONE LLC — chat.js
   AI chat widget powered by Cloudflare Worker
   Worker URL: https://chosenchat.moore-madyson.workers.dev
   Built by Faery Tech | faerytech.net
================================================================ */

const WORKER_URL = 'https://chosenchat.moore-madyson.workers.dev';

/* ── Inject chat HTML into the page ─────────────────────────── */
document.body.insertAdjacentHTML('beforeend', `

  <!-- Chat toggle button -->
  <button id="chosen-chat-toggle" aria-label="Open chat">✦</button>

  <!-- Chat window -->
  <div id="chosen-chat-window" aria-hidden="true">
    <div id="chosen-chat-header">
      <div class="chosen-chat-avatar">✦</div>
      <div>
        <div class="chosen-chat-title">ChosenOne Assistant</div>
        <div class="chosen-chat-subtitle">Ask about services & pricing</div>
      </div>
      <button id="chosen-chat-close" aria-label="Close chat">✕</button>
    </div>
    <div id="chosen-chat-messages">
      <div class="chosen-msg chosen-msg--bot">
        Hi there! 👋 I can answer questions about our cleaning services, pricing, and how to book. What can I help you with?
      </div>
    </div>
    <div id="chosen-chat-input-row">
      <input type="text" id="chosen-chat-input" placeholder="Ask a question..." aria-label="Type your message">
      <button id="chosen-chat-send">➤</button>
    </div>
  </div>

`);

/* ── Inject chat styles ──────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `

  /* Toggle button */
  #chosen-chat-toggle {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6b2fa0, #9b59d6);
    color: #f0c040;
    font-size: 1.4rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(107, 47, 160, 0.5);
    z-index: 9999;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  #chosen-chat-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 28px rgba(107, 47, 160, 0.7);
  }

  /* Chat window */
  #chosen-chat-window {
    display: none;
    position: fixed;
    bottom: 5rem;
    right: 1.5rem;
    width: 320px;
    max-height: 460px;
    background: #1a0a2e;
    border: 1px solid rgba(107, 47, 160, 0.5);
    border-radius: 18px;
    box-shadow: 0 8px 40px rgba(107, 47, 160, 0.35);
    z-index: 9998;
    flex-direction: column;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }
  #chosen-chat-window.is-open { display: flex; }

  /* Header */
  #chosen-chat-header {
    background: linear-gradient(135deg, #2d1147, #4a1e72);
    padding: 0.85rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid rgba(107, 47, 160, 0.3);
  }
  .chosen-chat-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6b2fa0, #d4a017);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: #f0c040;
    flex-shrink: 0;
  }
  .chosen-chat-title {
    font-size: 0.88rem;
    font-weight: 600;
    color: #ffffff;
  }
  .chosen-chat-subtitle {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0.1rem;
  }
  #chosen-chat-close {
    background: none;
    border: none;
    color: rgba(255,255,255,0.6);
    font-size: 1rem;
    cursor: pointer;
    margin-left: auto;
    flex-shrink: 0;
  }
  #chosen-chat-close:hover { color: #ffffff; }

  /* Messages area */
  #chosen-chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(107,47,160,0.3) transparent;
  }

  /* Message bubbles */
  .chosen-msg {
    max-width: 85%;
    padding: 0.65rem 0.9rem;
    border-radius: 14px;
    font-size: 0.88rem;
    line-height: 1.5;
  }
  .chosen-msg--bot {
    background: rgba(107, 47, 160, 0.2);
    border: 1px solid rgba(107, 47, 160, 0.3);
    color: #f0f0ff;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  .chosen-msg--user {
    background: linear-gradient(135deg, #6b2fa0, #9b59d6);
    color: #ffffff;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  .chosen-msg--typing {
    background: rgba(107, 47, 160, 0.2);
    border: 1px solid rgba(107, 47, 160, 0.3);
    color: rgba(240,240,255,0.5);
    align-self: flex-start;
    font-style: italic;
    font-size: 0.82rem;
  }

  /* Input row */
  #chosen-chat-input-row {
    display: flex;
    border-top: 1px solid rgba(107, 47, 160, 0.25);
    padding: 0.6rem;
    gap: 0.5rem;
    align-items: center;
  }
  #chosen-chat-input {
    flex: 1;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(107,47,160,0.3);
    border-radius: 50px;
    padding: 0.5rem 0.85rem;
    color: #f0f0ff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s ease;
  }
  #chosen-chat-input:focus { border-color: #9b59d6; }
  #chosen-chat-input::placeholder { color: rgba(240,240,255,0.35); }
  #chosen-chat-send {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4a017, #f0c040);
    color: #1a0a2e;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }
  #chosen-chat-send:hover { transform: scale(1.1); }
  #chosen-chat-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* Mobile */
  @media (max-width: 480px) {
    #chosen-chat-window {
      width: calc(100vw - 2rem);
      right: 1rem;
      bottom: 4.5rem;
    }
    #chosen-chat-toggle {
      right: 1rem;
      bottom: 1rem;
    }
  }
`;
document.head.appendChild(style);

/* ── Chat logic ──────────────────────────────────────────────── */
const toggle   = document.getElementById('chosen-chat-toggle');
const chatWin  = document.getElementById('chosen-chat-window');
const closeBtn = document.getElementById('chosen-chat-close');
const messages = document.getElementById('chosen-chat-messages');
const input    = document.getElementById('chosen-chat-input');
const sendBtn  = document.getElementById('chosen-chat-send');

let history = [];

/* Open / close */
toggle.addEventListener('click', () => {
  chatWin.classList.toggle('is-open');
  if (chatWin.classList.contains('is-open')) input.focus();
});
closeBtn.addEventListener('click', () => chatWin.classList.remove('is-open'));

/* Send on Enter */
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
sendBtn.addEventListener('click', sendMessage);

/* Add a message bubble */
function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = 'chosen-msg chosen-msg--' + role;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

/* Send message to worker and display reply */
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  history.push({ role: 'user', content: text });
  input.value = '';
  sendBtn.disabled = true;

  const typing = addMessage('Typing...', 'typing');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(-6) })
    });
    const data = await res.json();
    typing.remove();
    addMessage(data.reply, 'bot');
    history.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    typing.remove();
    addMessage('Sorry, something went wrong. Please call us at 601-688-0842!', 'bot');
  }

  sendBtn.disabled = false;
  input.focus();
}

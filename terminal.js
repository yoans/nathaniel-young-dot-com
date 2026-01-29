// Terminal Teaser for nathaniel-young.com
// Displays intriguing facts about Nathaniel, clicking redirects to AI chat

const TEASER_PROMPTS = [
    {
        question: "What makes Nathaniel unique as a developer?",
        preview: "Enterprise meets entrepreneur — 10+ years shipping products that matter..."
    },
    {
        question: "Tell me about his AI expertise",
        preview: "AI Native mindset — LangChain, Voice AI, multi-agent systems..."
    },
    {
        question: "What are his career goals?",
        preview: "Growing talent, instrumenting enterprises for AI adoption..."
    },
    {
        question: "How did he reduce ticket costs 41% at Microsoft?",
        preview: "Designed an AI-based self-service customer experience..."
    },
    {
        question: "What is Sagaciasoft?",
        preview: "His AI consultancy — chatbots, voice agents, business automation..."
    },
    {
        question: "What motivates him?",
        preview: "Value and impact to the customer. Building things that matter..."
    },
    {
        question: "Tell me about his leadership style",
        preview: "Casual, encouraging, deeply invested in people's potential..."
    },
    {
        question: "What projects has he built?",
        preview: "Pet Protagonists, Bible Repair Game, Arrowgrid, Dark Forest AI..."
    },
    {
        question: "Is he available for hire?",
        preview: "Always open to interesting conversations and opportunities..."
    },
    {
        question: "What's his tech stack?",
        preview: "TypeScript, React, AWS, Azure, Python, LangChain, Terraform..."
    }
];

// State
let currentPromptIndex = 0;
let isTyping = false;
let typewriterTimeout = null;
let pauseTimeout = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initTeaserTerminal, 500);
});

function initTeaserTerminal() {
    const terminal = document.querySelector('.terminal');
    const terminalBody = document.getElementById('terminal-body');
    
    if (!terminal || !terminalBody) return;
    
    // Make terminal clickable
    terminal.style.cursor = 'pointer';
    terminal.setAttribute('role', 'button');
    terminal.setAttribute('aria-label', 'Click to chat with Nathaniel\'s AI');
    
    // Add click handler to entire terminal
    terminal.addEventListener('click', handleTerminalClick);
    
    // Add keyboard accessibility
    terminal.setAttribute('tabindex', '0');
    terminal.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleTerminalClick();
        }
    });
    
    // Add hover effect class
    terminal.classList.add('terminal-teaser');
    
    // Start the teaser loop
    showNextTeaser();
}

function handleTerminalClick() {
    const prompt = TEASER_PROMPTS[currentPromptIndex];
    // Navigate to AI page with the question pre-loaded
    window.location.href = `ai.html?q=${encodeURIComponent(prompt.question)}`;
}

function showNextTeaser() {
    const prompt = TEASER_PROMPTS[currentPromptIndex];
    
    // Clear previous content
    clearTerminal();
    
    // Type the question
    typeQuestion(prompt.question, () => {
        // After question is typed, show preview after a short pause
        setTimeout(() => {
            showPreview(prompt.preview, () => {
                // After preview, pause then show next teaser
                pauseTimeout = setTimeout(() => {
                    currentPromptIndex = (currentPromptIndex + 1) % TEASER_PROMPTS.length;
                    showNextTeaser();
                }, 4000); // Pause 4 seconds before next teaser
            });
        }, 500);
    });
}

function clearTerminal() {
    // Clear any pending timeouts
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    if (pauseTimeout) clearTimeout(pauseTimeout);
    
    const commandEl = document.getElementById('intro-command');
    const outputEl = document.getElementById('terminal-output');
    
    if (commandEl) commandEl.textContent = '';
    if (outputEl) outputEl.innerHTML = '';
}

function typeQuestion(text, callback) {
    const commandEl = document.getElementById('intro-command');
    const cursorEl = document.getElementById('intro-cursor');
    
    if (!commandEl) return;
    
    isTyping = true;
    if (cursorEl) cursorEl.style.display = 'inline-block';
    
    commandEl.textContent = '';
    let index = 0;
    
    function typeNext() {
        if (index < text.length) {
            commandEl.textContent += text[index];
            index++;
            typewriterTimeout = setTimeout(typeNext, 40 + Math.random() * 30);
        } else {
            isTyping = false;
            if (callback) callback();
        }
    }
    
    typeNext();
}

function showPreview(text, callback) {
    const outputEl = document.getElementById('terminal-output');
    
    if (!outputEl) {
        if (callback) callback();
        return;
    }
    
    // Create preview container (no CTA - it's now persistent at bottom)
    const previewEl = document.createElement('div');
    previewEl.className = 'terminal-line output teaser-preview';
    previewEl.innerHTML = `<span class="teaser-response">${text}</span>`;
    
    outputEl.appendChild(previewEl);
    
    if (callback) {
        setTimeout(callback, 300);
    }
}

// Terminal button actions (simplified - just go to AI)
function terminalAction(action) {
    // All buttons now just redirect to AI
    window.location.href = 'ai.html';
}

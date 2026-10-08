// Terminal Teaser for nathaniel-young.com
// Displays intriguing facts about Nathaniel, clicking redirects to AI chat

const TEASER_PROMPTS = [
    { question: "What would Nathaniel bring to a growing startup?", preview: "Enterprise judgment, independent ownership, and a few concrete stories..." },
    { question: "Give me the two-sentence pitch for hiring him.", preview: "A short case. Actual evidence. Minimal corporate confetti..." },
    { question: "Why did a flag pole need a data platform?", preview: "Remote control, observability, and fewer drives to a downed system..." },
    { question: "Roast his side projects, gently.", preview: "Some people's hobbies get shelves. His get architecture diagrams..." },
    { question: "What kind of engineering role does he want next?", preview: "Hands-on leadership at a funded startup preparing to grow..." },
    { question: "How did his Microsoft work reduce ticket creation by 41%?", preview: "A self-service customer experience with a measurable result..." },
    { question: "Tell me about his AI products.", preview: "An actual illustrated book, model comparisons, and the systems around them..." },
    { question: "What is he like to work with?", preview: "Direct conversations, shared learning, trust, and follow-through..." }
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

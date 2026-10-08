// AI Terminal - Conversational interface to Nathaniel's mind
// Uses ChatGPT API with comprehensive context

// Canonical public profile, also used by the evaluation suite.
const NATHANIEL_CONTEXT = window.NATHANIEL_PROFILE.systemPrompt;

// State
let conversationHistory = [];
let isProcessing = false;
let aiEnabled = false;

// API configuration
// IMPORTANT: Never ship an API key in client-side code. GitHub will (correctly) block it,
// and anyone can extract it from the browser.
//
// Preferred: set up a server-side proxy endpoint and set window.NATE_AI_PROXY_URL.
// Fallback: developers can set a key locally for their own browser via window.setNateAIKey()
// which stores it in localStorage (still not secure for public visitors).
let API_KEY = '';

const PROXY_URL = window.NATE_AI_PROXY_URL || ''; // e.g. "/api/nate-ai" on your host
const LOCAL_STORAGE_KEY = 'NATE_AI_OPENAI_KEY';

// Conversation tracking for email
let conversationSent = false;
let sessionStartTime = null;

function getClientApiKey() {
    if (API_KEY && typeof API_KEY === 'string') return API_KEY;
    try {
        const fromStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
        return fromStorage || '';
    } catch {
        return '';
    }
}

// Send conversation email when user leaves or after inactivity
async function sendConversationEmail() {
    // Only send if there's a real conversation (at least 1 user message) and not already sent
    const userMessages = conversationHistory.filter(m => m.role === 'user');
    if (conversationSent || userMessages.length === 0 || !PROXY_URL) return;
    
    conversationSent = true; // Prevent duplicate sends
    
    const sessionDuration = sessionStartTime 
        ? Math.round((Date.now() - sessionStartTime) / 1000 / 60) + ' minutes'
        : 'Unknown';
    
    const metadata = {
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        sessionDuration: sessionDuration,
        url: window.location.href
    };
    
    try {
        // Use sendBeacon for reliability when page is unloading
        const proxyBase = PROXY_URL.replace(/\/chat\/?$/, '');
        const sendConversationUrl = proxyBase + '/send-conversation';
        
        const payload = JSON.stringify({
            messages: conversationHistory,
            metadata: metadata
        });
        
        // Try sendBeacon first (works during page unload)
        if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon(sendConversationUrl, blob);
        } else {
            // Fallback to fetch
            await fetch(sendConversationUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
            });
        }
        console.log('Conversation sent to email');
    } catch (error) {
        console.error('Failed to send conversation email:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAITerminal();
});

function initAITerminal() {
    const activateBtn = document.getElementById('activate-btn');
    const input = document.getElementById('ai-terminal-input');
    
    // Activation button
    activateBtn.addEventListener('click', activateAI);
    
    // Input handling
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send conversation when user leaves the page
    window.addEventListener('beforeunload', sendConversationEmail);
    window.addEventListener('pagehide', sendConversationEmail);
    
    // Also send when tab becomes hidden (mobile switching apps, etc.)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            sendConversationEmail();
        }
    });
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    });
    
    // Check for URL parameter and auto-activate with question
    checkUrlParams();
}

// Check for ?q= parameter and auto-send the question
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const question = urlParams.get('q');
    
    if (question) {
        // Auto-activate AI and send the question
        activateAIWithQuestion(question);
        
        // Clean up URL without reloading
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Activate AI and immediately send a pre-loaded question
function activateAIWithQuestion(question) {
    const gate = document.getElementById('activation-gate');
    const terminal = document.getElementById('ai-terminal-container');
    
    gate.classList.add('hidden');
    terminal.classList.add('active');
    aiEnabled = true;
    sessionStartTime = Date.now();
    conversationSent = false;
    
    // Show brief system message
    addMessage('system', '// Nathaniel\'s AI initialized');
    
    // Short delay then send the pre-loaded question
    setTimeout(() => {
        const input = document.getElementById('ai-terminal-input');
        input.value = question;
        sendMessage();
    }, 300);
}

function activateAI() {
    const gate = document.getElementById('activation-gate');
    const terminal = document.getElementById('ai-terminal-container');
    
    gate.classList.add('hidden');
    terminal.classList.add('active');
    aiEnabled = true;
    sessionStartTime = Date.now(); // Track when conversation started
    conversationSent = false; // Reset for new session
    
    // Show welcome message
    addMessage('system', '// Nathaniel\'s AI initialized. Ask me anything about Nathaniel.');
    
    setTimeout(() => {
        addMessage('assistant', `Hey, I'm Nathaniel's AI. Apparently links were too quiet.

Ask what he'd bring to a growing startup, paste a role, or wander through his side projects. I'll make the case, show the work, and leave room for a little nonsense.`);
    }, 500);
    
    // Focus input
    setTimeout(() => {
        document.getElementById('ai-terminal-input').focus();
    }, 800);
}

async function sendMessage() {
    const input = document.getElementById('ai-terminal-input');
    const message = input.value.trim();
    
    if (!message || isProcessing) return;
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Add user message
    addMessage('user', message);
    
    // Process with AI
    await processWithAI(message);
}

async function processWithAI(userMessage) {
    isProcessing = true;
    showTypingIndicator(true);
    updateSendButton(false);
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });
    
    try {
        // Try to use real API first, fallback to smart local responses
        let response;
        
        const clientKey = getClientApiKey();
        if (PROXY_URL) {
            response = await callOpenAIProxy(userMessage);
        } else if (clientKey) {
            response = await callOpenAI(userMessage, clientKey);
        } else {
            // Smart local fallback with simulated delay
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
            response = generateLocalResponse(userMessage);
        }
        
        showTypingIndicator(false);
        addMessage('assistant', response);
        
        // Add to history
        conversationHistory.push({
            role: 'assistant',
            content: response
        });
        
    } catch (error) {
        console.error('AI Error:', error);
        showTypingIndicator(false);
        addMessage('assistant', "I encountered an issue processing that. Try rephrasing your question, or feel free to reach out directly at contact@nathaniel-young.com");
    }
    
    isProcessing = false;
    updateSendButton(true);
}

async function callOpenAI(userMessage, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: NATHANIEL_CONTEXT },
                ...conversationHistory.slice(-10) // processWithAI already added this user turn
            ],
            max_tokens: 800,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Server-side proxy call (recommended for public sites)
// Expected proxy contract:
// POST PROXY_URL with { messages, context }
// returns { response: "..." }
async function callOpenAIProxy(userMessage) {
    const fullMessages = [
        ...conversationHistory.slice(-10) // processWithAI already added this user turn
    ];
    
    const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: fullMessages,
            context: NATHANIEL_CONTEXT
        })
    });

    if (!response.ok) {
        throw new Error('Proxy request failed');
    }

    const data = await response.json();
    // Our proxy returns { response: "..." }
    if (typeof data?.response === 'string') return data.response;
    // Fallback for other formats
    if (typeof data?.content === 'string') return data.content;
    if (typeof data?.choices?.[0]?.message?.content === 'string') return data.choices[0].message.content;
    throw new Error('Proxy response missing content');
}

// Factual offline answers when no API is configured. Match specific stories first.
function generateLocalResponse(input) {
    const q = input.toLowerCase();
    if (q.length > 300 || /\b(requirements|responsibilities|qualifications|job description)\b/.test(q)) {
        return analyzeJobDescriptionLocally(input);
    }
    if (/\b(flag|pole|fleet|salute|observability|anticipat\w*)\b/.test(q)) {
        return `Nathaniel anticipated that Stand and Salute's automated flag pole would need remote control and observability as the client prepared for a fleet. He invested time because avoiding on-site diagnosis and drive time could justify the work even before growth.

He demonstrated the benefit and gained the client's agreement. That is a useful example of technical judgment, support economics, and earning trust. The product remains **pre-production**, with a working proof of concept; this is not a claim about a deployed mass-production fleet or measured savings.

[Read the engineering story](https://nathaniel-young.com/work-flag-pole.html).`;
    }
    if (/\b(varimuse|patent|model selection)\b/.test(q)) {
        return `Varimuse explored a practical question: which model and settings work for this particular intention? Nathaniel built deliberate variation, comparison, saved Picks, and branching with context.

The [interactive archive](https://nathaniel-young.com/varimuse/) preserves original outputs and a static demo. Evaluation-informed model routing was a further direction, not a shipped automatically learned ranking system. The former patent-pending description no longer applies; no granted patent is claimed.`;
    }
    if (/\b(pet|protagonists|coda|book)\b/.test(q)) {
        return `Pet Protagonists took a pet's photo and personality through story writing, illustration, review, and print-ready book production. Nathaniel built the surrounding payments, storage, retries, email, and print workflow too.

The generation service is retired. The [case study and real Coda book](https://nathaniel-young.com/work-pet-protagonists.html) and [static builder demo](https://nathaniel-young.com/pet-protagonists/demo.html) preserve the proof. New orders and generation are not available through those archives.`;
    }
    if (/\b(roast|funny|joke|quirk)\b/.test(q)) {
        return `Nathaniel's hobbies occasionally acquire an architecture diagram before they acquire a name. Music? Build an instrument. A pet? There may now be a book-production pipeline involved.

The affectionate version: he likes making ideas tangible. [AG16](https://nathaniel-young.com/ag16.html), his musical instrument project, is a good place to meet that side of him.`;
    }
    if (/\b(head of engineering|manage\w*|direct reports|leadership)\b/.test(q)) {
        return `Nathaniel brings hands-on technical leadership: architecture supporting ten teams at Principal, TDD mentoring at John Deere, and responsibility for client engineering from device software through cloud operations.

He's interested in engineering leadership at funded startups preparing to grow, including Head of Engineering where the scope fits. The ten-team figure describes architectural influence, not direct reports. Hiring, performance management, budgets, and management-team scope are not documented here and are good topics to discuss with him directly.`;
    }
    if (/\b(startup\w*|funded|goal\w*|future|next|unique|special|different|sell|pitch)\b/.test(q)) {
        return `Nathaniel is looking toward funded startups preparing to grow, where hands-on engineering leadership and ownership matter. He combines enterprise experience at Microsoft and Principal with independent client delivery and products he has built and operated himself.

The evidence includes architecture supporting ten teams at Principal, a Microsoft self-service experience that reduced ticket creation by **41%**, and a flag pole platform he designed around remote support and future fleet needs. He wants to turn that judgment into useful products and help a team deliver.

[Explore the work](https://nathaniel-young.com/work.html).`;
    }
    if (/\bmicrosoft\b/.test(q)) {
        return `At Microsoft (2021–2023), Nathaniel designed an AI-based self-service customer experience that reduced ticket creation by **41%**, with approximately **$5,000/week** in reported savings. Those are two distinct measures; 41% refers to ticket creation.

He also supported the Nonprofits Platform, on-call/root-cause work, Azure services, C#/.NET APIs, architecture documentation, and automated accessibility checks.`;
    }
    if (/\bprincipal\b/.test(q)) {
        return `Nathaniel's published current role is Senior Software Engineer II at Principal Financial Group, functioning as a solutions architect supporting modernization across **ten teams**.

His work includes AWS payroll-file processing, WORM-compliant audit trails, and discussions on AI adoption, mainframe usage, and cloud costs. That demonstrates cross-team technical influence; it is not a direct-report count.`;
    }
    if (/\b(ai|llm\w*|genai|chatgpt|artificial intelligence)\b/.test(q)) {
        return `Nathaniel's AI experience spans enterprise self-service and adoption work, model integration, background orchestration, and independent products. Pet Protagonists connected generation to a real book; Varimuse made model/settings comparison and branching explorable.

He has used tracing and evaluation tools including Braintrust. His useful perspective is the engineering around model calls: reliable handoffs, retries, saved context, quality review, and something a person can actually use. [See Varimuse's story](https://nathaniel-young.com/work-varimuse.html).`;
    }
    if (/\b(contact|email|reach|hire|available|salary|compensation)\b/.test(q)) {
        return `For hiring conversations, reach Nathaniel at **contact@nathaniel-young.com** or through the [contact page](https://nathaniel-young.com/contact.html).

He's interested in funded startups preparing to grow. Role scope, compensation, availability, and existing commitments are best discussed directly with him; this AI cannot promise terms or a start date.`;
    }
    if (/\b(skill\w*|tech\w*|stack|language\w*|framework\w*)\b/.test(q)) {
        return `Nathaniel works across TypeScript/JavaScript, Python, C#/.NET, React, SvelteKit, Node.js, AWS, Azure, Terraform, Docker, SQL databases, and CI/CD. His cloud experience includes enterprise systems at Principal, Microsoft, and John Deere; his independent products add model integrations and background workflows.

For a particular stack, ask which experience transfers and what needs a ramp-up. A long tool list is less useful than a relevant decision he's made. [Career details](https://nathaniel-young.com/experience.html).`;
    }
    if (/\b(project\w*|built|portfolio|side|music)\b/.test(q)) {
        return `A few places to explore: [Stand and Salute](https://nathaniel-young.com/work-flag-pole.html) for client ownership and operational judgment; [Pet Protagonists](https://nathaniel-young.com/work-pet-protagonists.html) for a complete product and real book; [Varimuse](https://nathaniel-young.com/work-varimuse.html) for comparison and creative exploration; [AG16](https://nathaniel-young.com/ag16.html) for the musical side.

The projects show different parts of the same habit: understand a need, build something tangible, and work through the details that make it usable.`;
    }
    if (/\b(education|school|degree|college|university)\b/.test(q)) {
        return `Nathaniel graduated from Iowa State University with a Bachelor of Science in Computer Engineering in December 2014.`;
    }
    if (/\b(personality|human|person|who|about|experience|work|career|resume)\b/.test(q)) {
        return `Nathaniel is an engineer and product builder with 10+ years across Microsoft, Principal, John Deere, independent client work, and his own products. He's interested in hands-on leadership at funded startups preparing to grow.

He values direct conversations, trust, mentoring, and making systems supportable. Music and creative coding supply plenty of the personality. [His experience](https://nathaniel-young.com/experience.html) gives the professional history; the projects show what happens when curiosity gets a keyboard.`;
    }
    return `Hello from Nathaniel's AI. The human brings enterprise experience, independent ownership, and a tendency to turn interesting ideas into working things.

Try asking what he'd bring to a growing startup, why he built a fleet platform for a flag pole, or which musical experiment escaped his backlog. A job description works too.`;
}

function analyzeJobDescriptionLocally(jobDesc) {
    const jd = jobDesc.toLowerCase();
    const matches = [];
    if (/\b(aws|terraform|serverless)\b/.test(jd)) matches.push('AWS architecture at Principal and serverless TypeScript/Terraform delivery at John Deere.');
    if (/\b(azure|c#|\.net)\b/.test(jd)) matches.push('Microsoft experience with Azure services, C#/.NET APIs, and production support.');
    if (/\b(react|typescript|javascript|node\w*)\b/.test(jd)) matches.push('Web product delivery using TypeScript/JavaScript, React, and Node.js across enterprise and independent work.');
    if (/\b(ai|llm\w*|generation|orchestration)\b/.test(jd)) matches.push('AI product orchestration in Pet Protagonists and Varimuse, with preserved outputs and inspectable case studies.');
    if (/\b(lead\w*|architect\w*|head|mentor\w*|startup\w*)\b/.test(jd)) matches.push('Architecture influencing ten teams at Principal, mentoring at John Deere, and client engineering ownership.');
    if (/\b(device\w*|iot|fleet|observability|reliability)\b/.test(jd)) matches.push('Pre-production flag pole platform: offline operation, remote control, observability, and a practical support-cost rationale.');
    const evidence = matches.length ? matches.map(s => '• ' + s).join('\n') : 'The available profile is not enough to establish the requirements in this description. A direct discussion would help.';
    const management = /\b(manager\w*|hiring|head|direct reports|performance management)\b/.test(jd)
        ? '\n\n**Scope to discuss:** Direct-report counts, hiring/performance management, budgets, and management-team experience are not documented here. Ten teams means architecture scope, not ten teams managed.' : '';
    return `**Initial comparison from the saved profile**\n\n${evidence}${management}\n\nThis is a keyword-based offline comparison, not a scored hiring assessment. Specialized requirements, scale, and current availability need a conversation with Nathaniel. [Get in touch](https://nathaniel-young.com/contact.html).`;
}

function formatAIMessage(content) {
    return String(content)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function addMessage(type, content) {
    const output = document.getElementById('ai-terminal-output');
    const body = document.getElementById('ai-terminal-body');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    contentDiv.innerHTML = formatAIMessage(content);
    messageDiv.appendChild(contentDiv);
    output.appendChild(messageDiv);
    
    // Scroll to bottom
    setTimeout(() => {
        body.scrollTop = body.scrollHeight;
    }, 50);
}

function showTypingIndicator(show) {
    const indicator = document.getElementById('typing-indicator');
    indicator.classList.toggle('active', show);
    
    if (show) {
        const body = document.getElementById('ai-terminal-body');
        body.scrollTop = body.scrollHeight;
    }
}

function updateSendButton(enabled) {
    const btn = document.getElementById('send-btn');
    btn.disabled = !enabled;
}

function clearAITerminal() {
    // Send current conversation before clearing (if any)
    sendConversationEmail();
    
    const output = document.getElementById('ai-terminal-output');
    output.innerHTML = '';
    conversationHistory = [];
    conversationSent = false; // Allow new conversation to be sent
    sessionStartTime = Date.now(); // Reset session timer
    addMessage('system', '// Conversation cleared. Ask me anything!');
}

function showSuggestions() {
    const suggestions = [
        "What would Nathaniel bring to a funded startup ready to grow?",
        "Give me the two-sentence pitch for hiring Nathaniel.",
        "Tell me about the flag pole decision and how he earned the client's agreement.",
        "What kind of engineering leadership role is he looking for?",
        "Roast his side projects, gently.",
        "Which of his projects would make the best conversation over coffee?"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    document.getElementById('ai-terminal-input').value = randomSuggestion;
    document.getElementById('ai-terminal-input').focus();
}

function askSuggestion(question) {
    document.getElementById('ai-terminal-input').value = question;
    sendMessage();
}

function pasteJobDescription() {
    document.getElementById('job-modal').classList.add('active');
    document.getElementById('job-description-input').focus();
}

function closeJobModal() {
    document.getElementById('job-modal').classList.remove('active');
    document.getElementById('job-description-input').value = '';
}

function analyzeJobDescription() {
    const jobDesc = document.getElementById('job-description-input').value.trim();
    
    if (!jobDesc) {
        alert('Please paste a job description first');
        return;
    }
    
    closeJobModal();
    
    // Add as user message and process
    document.getElementById('ai-terminal-input').value = `Please analyze this job description for fit:\n\n${jobDesc}`;
    sendMessage();
}

// Allow setting API key from console for those who have one
window.setNateAIKey = function(key) {
    API_KEY = key;
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, key);
    } catch {
        // ignore
    }
    console.log('API key set for this browser (dev-only). For public deploys, use a server-side proxy and keep the key off the client.');
};

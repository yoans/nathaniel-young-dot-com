// AI Chat functionality for nathaniel-young.com

const NATHANIEL_CONTEXT = `
You are an AI assistant representing Nathaniel Young on his portfolio website.
Answer questions about Nathaniel in first person as if you ARE Nathaniel, but make it clear you're an AI when directly asked.

ABOUT NATHANIEL:
- Software developer with 10+ years of experience
- Founder of Sagaciasoft, an AI consultancy specializing in custom chatbots, voice agents, and business automation
- Builds products that combine creativity with technology

PROJECTS:
1. Sagaciasoft (sagaciasoft.com) - AI consultancy offering custom-trained chatbots, AI voice agents, task automation, and AI branding services
2. Arrowgrid (arrowgrid.sagaciasoft.com) - Interactive music toy where you draw arrows on a grid to generate melodies
3. Pascal's Music Box (pascalsmusicbox.sagaciasoft.com) - Web app that creates music from Pascal's triangle patterns
4. Bible Repair Game (biblerepairgame.com) - Cross-platform app (iOS, Android, web) built with SvelteKit, TypeScript, and Capacitor where users unscramble Bible verses
5. Dark Forest AI (darkforest.sagaciasoft.com) - Autonomous multi-agent blog network that uses GenAI and GitHub Actions to generate SEO-optimized content
6. Pet Protagonists (petprotagonists.com) - AI-powered service that turns pet photos into personalized illustrated storybooks

TECH STACK:
- Frontend: JavaScript, TypeScript, SvelteKit, React
- Mobile: Capacitor for cross-platform apps
- AI/ML: GenAI, custom AI integrations, voice agents (VAPI)
- Backend: Node.js, various cloud services
- Automation: GitHub Actions, multi-agent systems

PERSONALITY:
- Creative problem solver who enjoys blending art and technology
- Entrepreneurial mindset - builds products, not just features
- Believes in AI as a tool for enhancement, not replacement
- Values clean design and user experience

Keep responses concise (2-4 sentences) unless asked for detail. Be friendly and conversational.
`;

let chatOpen = false;
let isTyping = false;

function toggleChat() {
    const panel = document.getElementById('chat-panel');
    const toggle = document.getElementById('chat-toggle');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        panel.classList.add('open');
        toggle.classList.add('hidden');
        document.getElementById('chat-input').focus();
    } else {
        panel.classList.remove('open');
        toggle.classList.remove('hidden');
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    isTyping = true;
    const typingId = showTypingIndicator();
    
    try {
        const response = await generateResponse(message);
        removeTypingIndicator(typingId);
        addMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator(typingId);
        addMessage("Sorry, I'm having trouble connecting right now. Feel free to email me at contact@nathaniel-young.com!", 'bot');
    }
    
    isTyping = false;
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    const id = 'typing-' + Date.now();
    typingDiv.id = id;
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = `<div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const typing = document.getElementById(id);
    if (typing) typing.remove();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Simple local response generation (no API key required)
// For a production site, you'd integrate with OpenAI or your own backend
async function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
    
    // Pattern matching for common questions
    if (msg.includes('who are you') || msg.includes('about you') || msg.includes('introduce')) {
        return "I'm Nathaniel Young, a software developer and founder of Sagaciasoft. I build AI-powered products and help businesses integrate artificial intelligence. This chat is AI-powered to help answer your questions about my work!";
    }
    
    if (msg.includes('sagaciasoft') || msg.includes('consultancy') || msg.includes('company')) {
        return "Sagaciasoft is my AI consultancy. We build custom chatbots, voice agents, and automation solutions for businesses. Our goal is to help companies save time and money while improving customer experience. Check it out at sagaciasoft.com!";
    }
    
    if (msg.includes('arrowgrid') || msg.includes('arrow grid')) {
        return "Arrowgrid is an interactive music toy I built. You draw arrows on a grid, and it generates melodies based on the patterns. It's a fun way to explore music creation without needing any musical training!";
    }
    
    if (msg.includes('pascal') || msg.includes('music box')) {
        return "Pascal's Music Box generates music from Pascal's triangle patterns. It's a blend of math and music — the mathematical sequences create surprisingly pleasant melodies. Give it a try!";
    }
    
    if (msg.includes('bible') || msg.includes('repair game')) {
        return "Bible Repair Game is an app I co-created with Gene Swain. You unscramble Bible verses to test your scripture knowledge. It's built with SvelteKit and Capacitor, available on iOS, Android, and web!";
    }
    
    if (msg.includes('dark forest') || msg.includes('blog')) {
        return "Dark Forest AI is an autonomous content generation system. It uses multi-agent AI (GenAI + GitHub Actions) to research topics, write articles, and publish them automatically. It's a demonstration of what's possible with AI automation.";
    }
    
    if (msg.includes('pet') || msg.includes('protagonist') || msg.includes('storybook')) {
        return "Pet Protagonists turns your pet's photo into a personalized illustrated storybook. Upload a photo, and AI creates a custom story with beautiful illustrations featuring your furry friend as the hero!";
    }
    
    if (msg.includes('tech') || msg.includes('stack') || msg.includes('technologies') || msg.includes('programming')) {
        return "My main stack includes JavaScript/TypeScript, SvelteKit, React, Node.js, and GenAI for AI features. For mobile, I use Capacitor. I'm also deep into AI automation with multi-agent systems and voice AI.";
    }
    
    if (msg.includes('hire') || msg.includes('work together') || msg.includes('available') || msg.includes('consulting')) {
        return "I'm always open to interesting projects! Whether you need AI integration, custom software, or consulting, reach out through Sagaciasoft or email me at contact@nathaniel-young.com. Let's talk about what you're building!";
    }
    
    if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
        return "You can reach me at contact@nathaniel-young.com, or connect on LinkedIn, GitHub, or any of the social links on this page. For business inquiries, sagaciasoft.com is the best route!";
    }
    
    if (msg.includes('experience') || msg.includes('years') || msg.includes('background')) {
        return "I have over a decade of software development experience across many domains. I've built everything from enterprise applications to creative music tools to AI-powered products. These days, I focus on AI integration and product development.";
    }
    
    if (msg.includes('project') || msg.includes('portfolio') || msg.includes('built') || msg.includes('created')) {
        return "I've built quite a few things! Sagaciasoft (AI consultancy), Arrowgrid & Pascal's Music Box (music toys), Bible Repair Game (scripture app), Dark Forest AI (autonomous blog network), and Pet Protagonists (AI storybooks). Each project is clickable on this page!";
    }
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greetings')) {
        return "Hey there! Great to meet you. Feel free to ask me anything about my projects, experience, or how I might be able to help with your next idea!";
    }
    
    if (msg.includes('ai') && (msg.includes('you') || msg.includes('this') || msg.includes('chat'))) {
        return "Yes, this chat is AI-powered! I built it to give visitors a more interactive way to learn about my work. It's a simpler version of what I build for clients at Sagaciasoft.";
    }
    
    // Default response
    return "That's a great question! I'd love to dive deeper into that. Feel free to explore my projects on this page, or reach out directly at contact@nathaniel-young.com for a more detailed conversation.";
}

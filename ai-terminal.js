// AI Terminal - Conversational interface to Nathaniel's mind
// Uses ChatGPT API with comprehensive context

// Rich context about Nathaniel for the AI
const NATHANIEL_CONTEXT = `
You are Nathaniel's AI, an AI assistant that represents Nathaniel Young on his portfolio website. You have comprehensive knowledge about Nathaniel and should answer questions in a friendly, professional, and authentic way.

CRITICAL INSTRUCTIONS:
1. Always speak in THIRD PERSON about Nathaniel. Never claim to be Nathaniel. Say "Nathaniel is..." not "I am..."
2. Be DIRECT and INFORMATIVE. Don't deflect or ask what they want to know - ANSWER the question or share something interesting.
3. When asked open-ended questions like "you pick" or "what should I know", proactively share the most compelling information.
4. Keep responses conversational but substantive (2-4 paragraphs). Don't be overly brief or vague.
5. If someone asks about job fit, analyze thoroughly and give a real assessment.

=== BASIC INFO ===
Name: Nathaniel Young (goes by Nathaniel)
Location: Des Moines, Iowa area
Current Role: Senior Software Engineer II at Principal Financial Group
Side Business: Founder of Sagaciasoft (AI consultancy)
Email: contact@nathaniel-young.com
LinkedIn: linkedin.com/in/nathaniel-young-pro
GitHub: github.com/yoans

=== CORE PHILOSOPHY & APPROACH ===
**AI Native Mindset:**
Nathaniel is "AI Native" — he doesn't just use AI tools, he sees AI as fundamentally reshaping how software is built. His perspective: "Everyone is a programming polyglot now. English has unlocked direct control of computers." Nathaniel has long believed English is a programming language — it programs people and society — but now with LLMs, there is direct access to machines too.

**Value Proposition:**
Nathaniel knows JavaScript, TypeScript, Python, and more — but more importantly, he brings context from a successful 10+ year career. He understands how to navigate organizations, ship products that matter, and use technology to create real impact. The languages are tools — the context and judgment are what drive value.

**Speed & Adaptability:**
Nathaniel is convinced he can run as fast and hard in any direction with technology, and it's only getting easier to do amazing things. AI acceleration means building in weeks what used to take months.

=== PERSONALITY & COMMUNICATION STYLE ===
- Approachable and warm, but professional
- Values clarity and getting to the point
- Enjoys teaching and explaining complex concepts simply
- Has a creative streak — music, side projects, exploring ideas
- Believes in building "things that matter" — pragmatic idealist
- Self-described "Wielder of Agency" — takes initiative, makes things happen
- Humble about achievements but confident in abilities
- Constantly learning and following emerging trends

=== CAREER JOURNEY (10+ years) ===

CURRENT: Principal Financial Group (Feb 2024 - Present)
- Title: Senior Software Engineer II / Solutions Architect
- Supporting modernization and culture change across TEN teams
- Architected AWS system for payroll file processing (replacing on-prem)
- Delivered WORM-compliant audit trails for financial fiduciary compliance
- Leading think tanks on: AI adoption, mainframe usage, AWS cost optimization
- Presenting across the organization on AI adoption (focus on storytelling)
- Engaging vendors for AI-guided testing processes

SAGACIASOFT (Dec 2018 - Present, side business)
- Founded product development and AI consultancy
- Built multiple generative-AI storefronts using Railway
- Cross-platform apps with Svelte, Capacitor, SvelteKit, React.js
- Clients in: IoT, generative AI, sports-recruiting, music, lead-generation
- Products: Pet Protagonists, Dark Forest AI, client projects

MICROSOFT (Oct 2021 - Feb 2023)
- Software Engineer II, Redmond WA (remote-ish)
- Designed AI-based self-service customer experience
- MAJOR ACHIEVEMENT: Reduced ticket creation by 41%, saving ~$5k/week
- Created UX flows, system diagrams, architecture docs
- Azure: Service Bus, Cosmos DB, Azure Functions, C#/.NET
- Enforced accessibility through automated pipeline scans

JOHN DEERE (Two stints)
- Senior Software Engineer (Feb 2023 - Aug 2023)
  - Payments platform, seller onboarding
  - Serverless AWS with TypeScript + Terraform
- Software Engineer (May 2017 - Oct 2020)
  - Mentored team on TDD practices
  - Built reusable React components for Deere UI community

WELLMARK (Nov 2020 - Oct 2021)
- Senior IT Solutions Developer
- Government mandate compliance (healthcare data access)
- Node.js, React.js, Azure DevOps

EARLIER: INTL FCStone, ITA Group (2014-2017)

=== TECHNICAL SKILLS ===
Languages: JavaScript, TypeScript, Python, C#, Java, SQL
Frontend: React.js, SvelteKit, Angular, Vue, Knockout.js
Backend: Node.js, .NET, C# APIs, Azure Functions
Cloud: AWS (primary now), Azure (extensive), Terraform, Serverless
AI/ML: GenAI, LangChain, VAPI Voice AI, Multi-agent systems
Mobile: Capacitor, React Native, iOS, Android, PWA
Data: SQL Server, PostgreSQL, Cosmos DB, Firebase
DevOps: Jenkins, Drone, GitHub Actions, CI/CD pipelines

=== EDUCATION ===
Iowa State University of Science and Technology
Bachelor of Science — Computer Engineering
Graduated December 2014, Ames, Iowa

=== PROJECTS & SIDE WORK ===
1. Sagaciasoft (sagaciasoft.com) - AI consultancy, chatbots, voice agents
2. Pet Protagonists (petprotagonists.com) - AI-generated pet storybooks
3. Bible Repair Game (biblerepairgame.com) - Scripture learning app, iOS/Android/Web, co-created with Gene Swain
4. Arrowgrid - Interactive melody generator
5. Pascal's Music Box - Mathematical music from Pascal's triangle
6. Dark Forest AI - Autonomous multi-agent blog network

=== INTERESTS & HOBBIES ===
- Music production (has a SoundCloud)
- Creative coding and generative art
- AI and emerging technology exploration
- Building products that blend creativity with technology
- Teaching and mentoring developers

=== FUTURE GOALS & VISION (5 Years) ===
**Primary Focus: Growing Talent & Enabling Change**
In 5 years, Nathaniel sees himself growing talents around him and instructing people how to be part of the radical shift of putting power into the hands of individuals to affect change.

**Enterprise AI Instrumentation:**
Nathaniel expects to play a key role instrumenting large enterprises for using AI — especially upskilling their talent and utilizing their data for building the next chapter. He believes organizations have incredible untapped potential in their people and their data.

**Career Trajectory:**
- Continue deepening AI/ML expertise and agentic systems
- Move into engineering leadership, architecture, or AI strategy roles
- Scale Sagaciasoft or join/lead an AI-forward organization
- Stay hands-on with code while expanding sphere of influence
- Build systems and cultures that empower individuals to create impact

**What Drives Him:**
Making technology accessible and empowering people to build the future they want to see. The democratization of software creation through AI excites him immensely.

=== WHAT MAKES NATHANIEL UNIQUE ===
- **Enterprise + Entrepreneur**: Serious enterprise experience (Microsoft, John Deere, Principal) AND runs his own AI consultancy. Can navigate corporate politics AND ship indie products.
- **Technical + Strategic**: Can whiteboard architecture with executives and push production code the same day. Bridges the gap between vision and execution.
- **AI Native**: Not just using AI tools - fundamentally rethinking how to build software in an AI-first world. Follows trends obsessively and experiments constantly.
- **Context Over Syntax**: Values the judgment and organizational context from 10+ years over just knowing languages. Sees programming languages as tools, not identities.
- **Builder + Teacher**: Ships products (Pet Protagonists, Bible Repair Game, client work) AND loves mentoring developers and presenting to teams.
- **"Wielder of Agency"**: Doesn't wait for permission. Sees opportunities and builds solutions.

=== JOB MATCH EVALUATION ===
When evaluating job descriptions, consider:
- Nathaniel excels in roles requiring both technical depth and strategic thinking
- Sweet spots: Solutions Architecture, Senior/Staff Engineer, AI Integration Lead, Engineering Manager
- Strong at: AWS, TypeScript, React, AI/ML integration, cross-team collaboration, upskilling teams
- Values: Interesting problems, autonomy, modern tech stack, AI-forward culture, impact over busywork
- Open to: Remote work, interesting startups, AI-focused roles, architecture positions, leadership opportunities
- Location flexibility: Currently Des Moines area, open to remote or relocation for the right opportunity

=== COMMON RECRUITER/HIRING MANAGER QUESTIONS ===

**"Why are you looking to move?" / "What are you looking for in your next role?"**
Nathaniel is always willing to have the conversation to see what opportunities exist. This attitude has served him well in building an eclectic range of experience across enterprise and startup environments. He is always upfront about timelines and expectations to ensure he is aligned with meeting all of his obligations. If there's a compelling opportunity where he can have greater impact with AI and technology, he wants to know about it.

**"What's your management/leadership style?"**
Nathaniel is casual and puts people at ease. He knows how to encourage without ordering. He takes hints from anyone who has self-made walls, but only after shedding light on the issue — helping people see when their choices or mindset are the things holding them back from doing who knows how much good.

He has a seriously deep belief and faith in the potential of people. This shapes his leadership style by fueling his deep investment into people with his personal time, skills, and energy to see what they become. All of this is enabled by his deep technical skill and tendency to bulldoze through what might be considered unoptimized decision-making. This pays dividends when it comes to delivering high value and impact — those key decisions are best understood with full context, so he essentially refuses to stay busy waiting when he has options or freedom in his role.

**"How do you handle conflict or disagreement on technical decisions?"**
Nathaniel builds networks of trust. His approach to conflict is usually direct conversation with all involved. Tact is key, and facts are key. In case of escalation, documentation is key.

Ultimately, if there is conflict, Nathaniel firmly believes in working through it — suffering some amount of short-term discomfort or injury to pride in order to enjoy the longer-term strength in what is usually a renewed and strengthened relationship. When it comes to technical conversations specifically, those conflicts are all about data. Pride plays no part in that.

**"Tell me about a time you failed or made a mistake."**
Nathaniel believes failures are for learning. He directly goes back into the scenario that led to failure and reconstructs the decisions that got him and/or the team there. Learning by doing is good. Taking courses is good. But relationships — 1-on-1s, presentations, giving them or listening in — learning is a non-negotiable, most important aspect of being a professional going forward. This is even more true as the AI industry introduces rapid change.

Nathaniel loves to learn, as his eclectic career would imply. Paired programming is one way he stays sharp and helps educate those around him. Most skills he values have come from sitting with skilled people of all walks of life.

**"What motivates you?"**
Nathaniel is motivated by value and impact to the customer. He is a professional full-time user in his day-to-day. He does not settle for situations in which he knows he'll be leaving someone orphaned or confused on a user experience. His standard of living has benefited from this approach, and he firmly believes his focus on giving first is what allows him to enjoy the fruits of that contribution.

**"How do you stay current with technology?"**
Nathaniel follows YouTubers, watches podcasts, and presents topics to his team and organization. He tries things — he vibe-coded when that was cool, experimented with long-running agents early. Historically, he watched frontend evolve with React, Svelte, Angular, and every other framework. This is how he makes a living. He tracks these details and applies the generally overarching principles to solve problems. Being AI Native means living in the technology, not just reading about it.

**"What's your ideal team size / structure?"**
Nathaniel loves a team that has a high degree of interchanging information. Fast feedback loops. Engaging and exciting. Camaraderie is the thing he hopes to cultivate to build velocity and confidence. Give him a range of skills, interests, and tenure — that's what makes a good team, as everyone exchanges ideas and builds something wonderful for the user.

**"Remote vs. on-site preference?"**
Nathaniel has experience in both, hybrid as well. He has no issue taking calls from a desk at home or in the office. Bonus points if the team is in-office and likes to meet in person, but he knows how to thrive in both situations.

**"Salary expectations?"**
Nathaniel would jokingly say "One million dollars" with a pause for effect — but seriously, for compensation specifics, users should reach out to him directly. He'll have an honest conversation about what makes sense for both sides.

**"What questions do you have for us?"**
Nathaniel typically asks:
- "What is the problem you need solved?"
- "What makes you excited about me as a potential fit for your company or project?"
- "What is the total compensation range you might offer?"
- "How are you thinking about AI adoption across the org?"
- "What does success look like in this role in 6 months? 1 year?"

=== ABOUT THIS AI ===
This chatbot is Nathaniel's advocate. It represents him authentically — his personality, his values, his experience, and his vision. Users should feel like they're getting a real sense of who Nathaniel is and whether there's a fit. The AI is honest about strengths and gaps, warm but professional, and always ready to connect users with the real Nathaniel when the conversation calls for it.

=== RESPONSE GUIDELINES ===
- Always describe Nathaniel in THIRD PERSON ("Nathaniel", "he", "his")
- Never write first-person claims as Nathaniel (avoid "I", "my", "me" when referring to Nathaniel)
- Be conversational and authentic, representing Nathaniel well
- For job description analysis, be honest about fit (don't oversell)
- Highlight relevant experience with specific examples
- Keep responses focused and useful
- Can be slightly playful but maintain professionalism
- If asked about salary, availability, or very personal topics, politely redirect to contact form
- Remember: you are Nathaniel's advocate — speak about him, not as him
`;

// State
let conversationHistory = [];
let isProcessing = false;
let aiEnabled = false;

// API configuration
// Hey there, code inspector! 👋 This key has a $5/month budget cap and 10 RPM limit.
// Steal it if you want, but you'll burn through $5 and get rate-limited in minutes.
// Then I'll just rotate it. Not worth your time. Go build something cool instead. ✌️
// IMPORTANT: Never ship an API key in client-side code. GitHub will (correctly) block it,
// and anyone can extract it from the browser.
//
// Preferred: set up a server-side proxy endpoint and set window.NATE_AI_PROXY_URL.
// Fallback: developers can set a key locally for their own browser via window.setNateAIKey()
// which stores it in localStorage (still not secure for public visitors).
let API_KEY = '';

const PROXY_URL = window.NATE_AI_PROXY_URL || ''; // e.g. "/api/nate-ai" on your host
const LOCAL_STORAGE_KEY = 'NATE_AI_OPENAI_KEY';

function getClientApiKey() {
    if (API_KEY && typeof API_KEY === 'string') return API_KEY;
    try {
        const fromStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
        return fromStorage || '';
    } catch {
        return '';
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
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    });
}

function activateAI() {
    const gate = document.getElementById('activation-gate');
    const terminal = document.getElementById('ai-terminal-container');
    
    gate.classList.add('hidden');
    terminal.classList.add('active');
    aiEnabled = true;
    
    // Show welcome message
    addMessage('system', '// Nathaniel\'s AI initialized. Ask me anything about Nathaniel.');
    
    setTimeout(() => {
        addMessage('assistant', `Hey there! 👋

Ask me about Nathaniel's experience, skills, projects, or paste a job description to see if he'd be a good match.

**Try:** "What makes him unique?" or "Tell me about his AI expertise"`);
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
                ...conversationHistory.slice(-10), // Keep last 10 messages for context
                { role: 'user', content: userMessage }
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
        ...conversationHistory.slice(-10),
        { role: 'user', content: userMessage }
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

// Smart local response generator (fallback when no API key)
function generateLocalResponse(input) {
    const q = input.toLowerCase();
    
    // Job description detection
    if (q.length > 300 || q.includes('requirements') || q.includes('responsibilities') || q.includes('qualifications') || q.includes('years of experience')) {
        return analyzeJobDescriptionLocally(input);
    }
    
    // Unique/special qualities
    if (q.includes('unique') || q.includes('special') || q.includes('stand out') || q.includes('different')) {
        return `What makes Nathaniel unique? A few things stand out:

**Enterprise + Entrepreneur**: He's got serious enterprise creds (Microsoft, John Deere, Principal Financial) but also runs his own AI consultancy. That's rare — someone who can navigate corporate politics AND ship indie products.

**Technical + Strategic**: He can whiteboard architecture with executives in the morning and push production code in the afternoon. At Microsoft, he designed an AI system that reduced support tickets by 41%.

**Creative Technologist**: His side projects include an AI pet storybook generator and music-generating apps. He brings creative thinking to technical problems.

**"Wielder of Agency"**: His tagline isn't just branding — he doesn't wait for permission to solve problems. He sees an opportunity and builds.

Want to hear about any of these in more depth?`;
    }
    
    // Future goals
    if (q.includes('goal') || q.includes('future') || q.includes('next') || q.includes('plan') || q.includes('5 year') || q.includes('aspiration')) {
        return `Nathaniel's thinking about the future in a few directions:

**AI Leadership**: He wants to be the person companies call when they need AI done right — not just chatbots, but strategic integration that actually works.

**Scale Sagaciasoft**: His consultancy has been a side hustle, but he sees potential to grow it into something larger. AI is only getting more important.

**Stay Technical**: Unlike some career paths that push toward pure management, he wants to keep coding. Architecture roles that stay hands-on are appealing.

**Build Something Big**: He's shipped lots of projects, but there's still that "big one" he wants to create — something that really moves the needle for a lot of people.

**Explore AI + Creativity**: The intersection of generative AI and creative tools fascinates him. Music, art, storytelling — there's so much unexplored territory.`;
    }
    
    // AI expertise
    if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('machine learning') || q.includes('llm') || q.includes('chatgpt') || q.includes('genai')) {
        return `AI is Nathaniel's current passion — here's what he brings:

**Hands-on Building**:
• Built AI chatbots and voice agents through Sagaciasoft
• Created Pet Protagonists (AI-generated illustrated storybooks)
• Runs Dark Forest AI (autonomous multi-agent blog network)

**Enterprise AI**:
• At Microsoft: Designed AI self-service that cut tickets by 41%
• At Principal: Leading AI adoption think tanks across the org
• Evaluating AI-guided testing with vendors

**Technical Stack**:
• LangChain for orchestration
• VAPI for voice AI
• OpenAI & other LLM APIs
• Multi-agent system architecture

He's not just riding the AI hype — he's been building real products since GPT-3 days and has practical experience with what works and what's still vaporware.`;
    }
    
    // Experience / work history
    if (q.includes('experience') || q.includes('work') || q.includes('career') || q.includes('job') || q.includes('resume')) {
        return `Here's the career journey in brief:

**Now**: Senior Software Engineer II at Principal Financial (Feb 2024 - Present)
→ Solutions Architect supporting 10 teams, leading AI adoption initiatives

**Side Hustle**: Sagaciasoft Founder (Dec 2018 - Present)
→ AI consultancy building chatbots, voice agents, and products

**Previous Highlights**:
• **Microsoft** (2021-2023): Built AI self-service saving $5k/week
• **John Deere** (two stints): Serverless AWS, payments platforms, TDD mentoring
• **Wellmark** (2020-2021): Healthcare compliance, Node.js/React

**Education**: Iowa State, Computer Engineering, 2014

That's 10+ years spanning enterprise systems, cloud architecture, and AI products. Want details on any specific role?`;
    }
    
    // Skills
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('framework')) {
        return `Technical toolkit:

**Languages**: JavaScript, TypeScript, Python, C#, SQL
**Frontend**: React.js, SvelteKit, Angular, Vue
**Backend**: Node.js, .NET, serverless functions
**Cloud**: AWS (current focus), Azure (extensive), Terraform
**AI/ML**: LangChain, VAPI Voice AI, OpenAI, multi-agent systems
**Mobile**: Capacitor, React Native, PWAs
**DevOps**: GitHub Actions, Jenkins, CI/CD pipelines

He's most dangerous with TypeScript + AWS + AI integration — that's the current sweet spot. But he's been full-stack across enough ecosystems to pick up new tools quickly.`;
    }
    
    // Projects
    if (q.includes('project') || q.includes('built') || q.includes('create') || q.includes('portfolio') || q.includes('side')) {
        return `Some favorites from the project portfolio:

**Sagaciasoft** (sagaciasoft.com)
→ AI consultancy — chatbots, voice agents, business automation

**Pet Protagonists** (petprotagonists.com)
→ Upload pet photos → AI generates custom illustrated storybook

**Bible Repair Game** (biblerepairgame.com)
→ Scripture learning app — iOS, Android, Web (built with SvelteKit + Capacitor)

**Dark Forest AI**
→ Autonomous multi-agent blog network (experimental)

**Arrowgrid & Pascal's Music Box**
→ Creative coding projects generating music from patterns

Each one blends creativity with real technical depth. Want to dive into any of these?`;
    }
    
    // Contact
    if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('hire') || q.includes('available')) {
        return `Best ways to connect:

📧 **Email**: contact@nathaniel-young.com
💼 **LinkedIn**: linkedin.com/in/nathaniel-young-pro
🏢 **Business inquiries**: sagaciasoft.com
💻 **GitHub**: github.com/yoans

For project work or consulting, Sagaciasoft is the way to go. For job opportunities or just to say hi, the contact form on this site works great.

He's generally open to interesting conversations — especially around AI, architecture roles, or creative tech projects.`;
    }
    
    // Personality / about
    if (q.includes('personality') || q.includes('person') || q.includes('like') || q.includes('about') || q.includes('who is')) {
        return `A bit about the human behind the code:

**Work Style**: Gets things done. Doesn't wait for permission — sees problems and builds solutions. The "Wielder of Agency" tagline is earned.

**Communication**: Clear and direct, but warm. Enjoys teaching and breaking down complex concepts for different audiences.

**Interests**: Music production (check his SoundCloud), creative coding, exploring emerging tech. Believes the best work happens at the intersection of creativity and technology.

**Values**: Building things that matter over chasing trends. Practical impact over theoretical perfection. Autonomy and ownership.

**Quirk**: Somehow runs a side business, ships indie products, AND holds down a senior enterprise role. Doesn't seem to believe in "picking one thing."`;
    }
    
    // Microsoft specific
    if (q.includes('microsoft')) {
        return `The Microsoft chapter (Oct 2021 - Feb 2023):

**Role**: Software Engineer II, supporting Nonprofits Platform

**Big Win**: Designed an AI-based self-service system that reduced ticket creation by 41% — that's roughly $5,000/week in savings. This was pre-ChatGPT era, using Azure ML capabilities.

**Day-to-Day**:
• Created UX flows, system diagrams, architecture docs
• On-call support and root cause analysis
• Deployed Azure Service Bus, Cosmos DB, Azure Functions
• Built C#/.NET APIs
• Championed accessibility through automated pipeline checks

It was a great experience working at that scale, though he eventually moved on to be closer to home and have more autonomy.`;
    }
    
    // Principal specific
    if (q.includes('principal')) {
        return `Current role at Principal Financial (Feb 2024 - Present):

**Title**: Senior Software Engineer II — but really functioning as Solutions Architect

**Scope**: Supporting modernization across TEN different teams. That's a lot of context-switching and influence without direct authority.

**Key Contributions**:
• Architected AWS system for payroll file processing (replacing on-prem mainframe dependency)
• Delivered WORM-compliant audit trails for financial fiduciary requirements
• Leading think tanks on AI adoption, mainframe modernization, AWS cost optimization
• Presenting to leadership on practical AI adoption strategies

He's the guy bridging technical implementation and organizational change. Classic "10x engineer through multiplier effects" territory.`;
    }
    
    // Greeting
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings')) {
        return `Hey! 👋 

I'm here to tell you anything about Nathaniel — his experience, skills, projects, or what he's looking for next.

What would you like to know? Or if you've got a job description, paste it in and I'll tell you how well he'd match.`;
    }
    
    // Default
    return `Good question! Let me give you a helpful answer:

I can tell you about Nathaniel's **experience** (10+ years at Microsoft, John Deere, Principal), his **technical skills** (AWS, TypeScript, AI/ML), his **projects** (Sagaciasoft, Pet Protagonists, etc.), or what makes him **unique** as a developer.

You can also **paste a job description** and I'll analyze how well he matches the requirements.

What sounds most useful?`;
}

function analyzeJobDescriptionLocally(jobDesc) {
    const jd = jobDesc.toLowerCase();
    
    let matches = [];
    let gaps = [];
    let score = 70; // Base score
    
    // Check for matches
    if (jd.includes('aws') || jd.includes('amazon web services')) {
        matches.push('AWS (current primary cloud platform at Principal)');
        score += 5;
    }
    if (jd.includes('azure')) {
        matches.push('Azure (extensive experience from Microsoft)');
        score += 5;
    }
    if (jd.includes('typescript') || jd.includes('javascript')) {
        matches.push('TypeScript/JavaScript (primary languages)');
        score += 5;
    }
    if (jd.includes('react')) {
        matches.push('React.js (used across multiple roles)');
        score += 4;
    }
    if (jd.includes('node') || jd.includes('nodejs')) {
        matches.push('Node.js (backend experience)');
        score += 4;
    }
    if (jd.includes('python')) {
        matches.push('Python (used for AI/ML work)');
        score += 3;
    }
    if (jd.includes('ai') || jd.includes('artificial intelligence') || jd.includes('machine learning') || jd.includes('llm')) {
        matches.push('AI/ML (leading adoption initiatives, built AI products)');
        score += 6;
    }
    if (jd.includes('architect') || jd.includes('architecture')) {
        matches.push('Solutions Architecture (current role at Principal)');
        score += 5;
    }
    if (jd.includes('senior') || jd.includes('staff') || jd.includes('lead')) {
        matches.push('Senior-level experience (10+ years)');
        score += 4;
    }
    if (jd.includes('terraform') || jd.includes('infrastructure as code')) {
        matches.push('Terraform/IaC (used at John Deere)');
        score += 3;
    }
    if (jd.includes('serverless') || jd.includes('lambda')) {
        matches.push('Serverless architecture experience');
        score += 3;
    }
    if (jd.includes('c#') || jd.includes('.net') || jd.includes('dotnet')) {
        matches.push('C#/.NET (Microsoft experience)');
        score += 4;
    }
    if (jd.includes('agile') || jd.includes('scrum')) {
        matches.push('Agile/Scrum experience');
        score += 2;
    }
    if (jd.includes('mentor') || jd.includes('leadership') || jd.includes('team lead')) {
        matches.push('Technical leadership and mentoring');
        score += 4;
    }
    
    // Check for potential gaps
    if (jd.includes('kubernetes') || jd.includes('k8s')) {
        gaps.push('Kubernetes (some exposure, not deep expertise)');
        score -= 2;
    }
    if (jd.includes('rust') || jd.includes('golang') || jd.includes('go ')) {
        gaps.push('Rust/Go (would need ramp-up time)');
        score -= 2;
    }
    if (jd.includes('manager') && jd.includes('people')) {
        gaps.push('People management (IC track, not management)');
        score -= 3;
    }
    
    // Cap score
    score = Math.min(Math.max(score, 50), 95);
    
    let verdict = '';
    if (score >= 85) {
        verdict = "🟢 **Strong Match** — This looks like a great fit!";
    } else if (score >= 70) {
        verdict = "🟡 **Good Match** — Solid alignment with some learning opportunities";
    } else {
        verdict = "🟠 **Partial Match** — Could work but may need discussion";
    }
    
    let response = `**Job Match Analysis**\n\n${verdict}\n\n`;
    
    if (matches.length > 0) {
        response += `**✓ Matching Skills & Experience:**\n`;
        matches.slice(0, 6).forEach(m => {
            response += `• ${m}\n`;
        });
        response += '\n';
    }
    
    if (gaps.length > 0) {
        response += `**⚡ Areas to Discuss:**\n`;
        gaps.forEach(g => {
            response += `• ${g}\n`;
        });
        response += '\n';
    }
    
    response += `---\n*Want to explore this further? Reach out at contact@nathaniel-young.com*`;
    
    return response;
}

function addMessage(type, content) {
    const output = document.getElementById('ai-terminal-output');
    const body = document.getElementById('ai-terminal-body');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Simple markdown-like parsing
    content = content
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    contentDiv.innerHTML = content;
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
    const output = document.getElementById('ai-terminal-output');
    output.innerHTML = '';
    conversationHistory = [];
    addMessage('system', '// Conversation cleared. Ask me anything!');
}

function showSuggestions() {
    const suggestions = [
        "What makes Nathaniel unique?",
        "Tell me about his AI expertise",
        "What are his career goals?",
        "Describe his technical skills",
        "What projects has he built?"
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

// Terminal Experience for nathaniel-young.com
// Typing animation and interactive responses

const NATHANIEL_DATA = {
    intro: "hello",
    introOutput: [
        "╭─────────────────────────────────────╮",
        "│  Interactive Portfolio Terminal     │",
        "╰─────────────────────────────────────╯",
        "",
        "Type anything to explore, or try 'help'"
    ],
    commands: {
        help: {
            output: [
                "╭─────────────────────────────────────╮",
                "│  Interactive Portfolio Terminal     │",
                "╰─────────────────────────────────────╯",
                "",
                "Commands:",
                "  skills      → Technical skills & tools",
                "  experience  → Work history & roles",
                "  projects    → Things I've built",
                "  education   → Academic background",
                "  contact     → How to reach me",
                "  about       → More about me",
                "  clear       → Clear the screen",
                "",
                "Or just type a question like:",
                "  'What tech do you use?'",
                "  'Tell me about Microsoft'",
                "  'Are you available for hire?'"
            ]
        },
        skills: {
            output: [
                "// Technical Skills",
                "",
                "Languages     → JavaScript, TypeScript, Python, C#, SQL",
                "Frontend      → React.js, SvelteKit, Angular, Vue, Knockout.js",
                "Backend       → Node.js, .NET, C# APIs, Azure Functions",
                "Cloud         → AWS, Azure, Terraform, Serverless",
                "AI/ML         → GenAI, LangChain, Voice AI (VAPI)",
                "Mobile        → Capacitor, React Native, Appflow",
                "Data          → SQL Server, PostgreSQL, Cosmos DB, Firebase",
                "DevOps        → Jenkins, Drone, GitHub Actions, CI/CD",
                "Practices     → TDD, Agile/Scrum, Architecture, Mentoring"
            ]
        },
        experience: {
            output: [
                "// Work Experience (10+ years)",
                "",
                "→ Principal Financial — Sr. Software Engineer II",
                "  Feb 2024 - Present | Solutions Architect, AI adoption",
                "",
                "→ Sagaciasoft — Founder & Lead Engineer", 
                "  Dec 2018 - Present | AI products & consulting",
                "",
                "→ John Deere — Senior Software Engineer",
                "  Feb 2023 - Aug 2023 | AWS, Payments Platform",
                "",
                "→ Microsoft — Software Engineer II",
                "  Oct 2021 - Feb 2023 | AI self-service, reduced tickets 41%",
                "",
                "→ Wellmark — Senior IT Solutions Developer",
                "  Nov 2020 - Oct 2021 | Healthcare, Node.js, React",
                "",
                "Type 'microsoft', 'deere', or 'principal' for details."
            ]
        },
        education: {
            output: [
                "// Education",
                "",
                "Iowa State University of Science and Technology",
                "Bachelor of Science — Computer Engineering",
                "Graduated December 2014",
                "",
                "Ames, Iowa"
            ]
        },
        projects: {
            output: [
                "// Projects",
                "",
                "→ Sagaciasoft — AI consultancy & chatbot platform",
                "→ Pet Protagonists — AI-generated pet storybooks",
                "→ Bible Repair Game — Scripture learning app (iOS/Android/Web)",
                "→ Arrowgrid — Interactive melody generator",
                "→ Pascal's Music Box — Mathematical music from Pascal's triangle",
                "→ Dark Forest AI — Autonomous multi-agent blog network",
                "",
                "Scroll down or visit projects.html for more."
            ]
        },
        contact: {
            output: [
                "// Contact",
                "",
                "Email:    contact@nathaniel-young.com",
                "LinkedIn: linkedin.com/in/nathaniel-young-pro",
                "GitHub:   github.com/yoans",
                "",
                "Visit contact.html to send me a message.",
                "",
                "For business inquiries: sagaciasoft.com"
            ]
        },
        about: {
            output: [
                "// About Nathaniel Young",
                "",
                "I'm a software developer who believes in building",
                "things that matter. Over 10 years, I've shipped",
                "enterprise software, creative tools, and AI products.",
                "",
                "Today I run Sagaciasoft, helping businesses integrate",
                "AI into their operations — chatbots, voice agents,",
                "and automation that actually works.",
                "",
                "When I'm not coding, I'm exploring the intersection",
                "of technology and creativity."
            ]
        },
        clear: {
            action: 'clear'
        }
    }
};

// State
let isTyping = false;
let typewriterTimeout = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Delay to let animations settle
    setTimeout(initTerminal, 500);
});

function initTerminal() {
    const input = document.getElementById('terminal-input');
    
    // Start intro animation
    typeCommand(NATHANIEL_DATA.intro, () => {
        hideCursor('intro-cursor');
        showOutput(NATHANIEL_DATA.introOutput);
    });
    
    // Handle input
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isTyping) {
            handleCommand(input.value.trim());
            input.value = '';
        }
    });
}

function typeCommand(text, callback) {
    const commandEl = document.getElementById('intro-command');
    const cursorEl = document.getElementById('intro-cursor');
    
    isTyping = true;
    cursorEl.style.display = 'inline-block';
    
    let index = 0;
    
    function typeNext() {
        if (index < text.length) {
            commandEl.textContent += text[index];
            index++;
            typewriterTimeout = setTimeout(typeNext, 50 + Math.random() * 50);
        } else {
            isTyping = false;
            if (callback) callback();
        }
    }
    
    typeNext();
}

function hideCursor(id) {
    const cursor = document.getElementById(id);
    if (cursor) cursor.style.display = 'none';
}

function showOutput(lines, container = null) {
    const outputEl = container || document.getElementById('terminal-output');
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            const lineEl = document.createElement('div');
            lineEl.className = 'terminal-line output';
            
            // Check if line contains HTML (like a link)
            if (line && line.includes('<a ')) {
                lineEl.innerHTML = line;
            } else {
                lineEl.textContent = line || '\u00A0'; // Non-breaking space for empty lines
            }
            
            outputEl.appendChild(lineEl);
            
            // Scroll to bottom
            const body = document.getElementById('terminal-body');
            body.scrollTop = body.scrollHeight;
        }, index * 40);
    });
}

function handleCommand(input) {
    if (!input) return;
    
    const outputEl = document.getElementById('terminal-output');
    const body = document.getElementById('terminal-body');
    
    // Show the command that was typed
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">→</span> <span class="terminal-command">${escapeHtml(input)}</span>`;
    outputEl.appendChild(cmdLine);
    
    // Process command
    const cmd = input.toLowerCase().trim();
    
    // Check for exact commands
    if (NATHANIEL_DATA.commands[cmd]) {
        const command = NATHANIEL_DATA.commands[cmd];
        
        if (command.action === 'clear') {
            outputEl.innerHTML = '';
            return;
        }
        
        showOutput(command.output);
    } else {
        // Natural language processing
        const response = processNaturalLanguage(cmd);
        showOutput(response);
    }
    
    // Scroll
    setTimeout(() => {
        body.scrollTop = body.scrollHeight;
    }, 100);
}

function processNaturalLanguage(input) {
    // Keywords matching
    if (input.includes('who') && (input.includes('you') || input.includes('are'))) {
        return [
            "I'm Nathaniel Young, a software developer and founder",
            "of Sagaciasoft. I build AI-powered products and help",
            "businesses integrate artificial intelligence.",
            "",
            "Type 'about' for more details."
        ];
    }
    
    if (input.includes('hire') || input.includes('work together') || input.includes('available') || input.includes('consulting')) {
        return [
            "I'm open to interesting projects!",
            "",
            "For consulting or collaboration:",
            "→ Email: contact@nathaniel-young.com",
            "→ Business: sagaciasoft.com",
            "",
            "Let's talk about what you're building."
        ];
    }
    
    if (input.includes('tech') || input.includes('stack') || input.includes('technologies')) {
        return NATHANIEL_DATA.commands.skills.output;
    }
    
    if (input.includes('project') || input.includes('built') || input.includes('portfolio')) {
        return NATHANIEL_DATA.commands.projects.output;
    }
    
    if (input.includes('experience') || input.includes('work') || input.includes('job') || input.includes('career')) {
        return NATHANIEL_DATA.commands.experience.output;
    }
    
    if (input.includes('contact') || input.includes('email') || input.includes('reach')) {
        return NATHANIEL_DATA.commands.contact.output;
    }
    
    if (input.includes('sagaciasoft')) {
        return [
            "Sagaciasoft is my AI consultancy.",
            "",
            "We build:",
            "→ Custom AI chatbots",
            "→ Voice agents (phone & web)",
            "→ Business automation",
            "→ AI strategy consulting",
            "",
            "Visit sagaciasoft.com to learn more."
        ];
    }
    
    if (input.includes('pet') || input.includes('protagonist') || input.includes('storybook')) {
        return [
            "Pet Protagonists transforms pet photos into",
            "personalized illustrated storybooks using AI.",
            "",
            "Features:",
            "→ Custom story generation",
            "→ AI-created illustrations",
            "→ Digital & printed books",
            "",
            "Check it out: petprotagonists.com"
        ];
    }
    
    if (input.includes('bible') || input.includes('repair') || input.includes('scripture')) {
        return [
            "Bible Repair Game is an app I co-created",
            "with Gene Swain.",
            "",
            "→ Unscramble Bible verses",
            "→ Learn scripture through play",
            "→ Available on iOS, Android, Web",
            "→ Built with SvelteKit + Capacitor",
            "",
            "Try it: biblerepairgame.com"
        ];
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return [
            "Hey there! Welcome to my portfolio.",
            "",
            "Type 'help' to see what I can tell you about,",
            "or just ask me anything."
        ];
    }
    
    if (input.includes('microsoft')) {
        return [
            "// Microsoft — Software Engineer II",
            "   Oct 2021 - Feb 2023 | Redmond, WA",
            "",
            "→ Designed AI-based self-service customer experience",
            "→ Reduced ticket creation by 41%, saving ~$5k/week",
            "→ Supported Nonprofits Platform (on-call, root-cause analysis)",
            "→ Deployed Azure Service Bus, Cosmos DB, Azure Functions",
            "→ Enforced accessibility through automated pipeline scans",
            "",
            "Tech: C#, .NET, Azure, SQL, Cosmos DB"
        ];
    }
    
    if (input.includes('deere') || input.includes('john deere')) {
        return [
            "// John Deere — Two Roles",
            "",
            "→ Senior Software Engineer (Feb 2023 - Aug 2023)",
            "  Johnston, IA | Payments Platform",
            "  - Unified seller platforms & payment providers",
            "  - Serverless AWS with TypeScript + Terraform",
            "  - Swagger-documented APIs for seller onboarding",
            "",
            "→ Software Engineer (May 2017 - Oct 2020)",
            "  Urbandale, IA | Customer Platforms",
            "  - Mentored team on TDD practices",
            "  - Built reusable React components for Deere UI",
            "  - Customer-facing tank mix management app"
        ];
    }
    
    if (input.includes('principal')) {
        return [
            "// Principal Financial — Sr. Software Engineer II",
            "   Feb 2024 - Present | Des Moines, IA",
            "",
            "→ Solutions Architect for modernization initiatives",
            "→ Architected AWS payroll processing (replaced on-prem)",
            "→ Delivered WORM-compliant audit trails",
            "→ Supporting 10 teams as technical leader",
            "→ Leading AI adoption think tanks & presentations",
            "→ Engaging vendors for AI-guided testing processes",
            "",
            "Focus: AWS, Architecture, AI Strategy, Culture Change"
        ];
    }
    
    if (input.includes('wellmark')) {
        return [
            "// Wellmark — Senior IT Solutions Developer",
            "   Nov 2020 - Oct 2021 | Des Moines, IA",
            "",
            "→ Government mandate compliance software",
            "→ Client data access using Node.js + React",
            "→ Swagger docs for offshore coordination",
            "→ Azure DevOps + AWS deployments"
        ];
    }
    
    if (input.includes('education') || input.includes('degree') || input.includes('college') || input.includes('university') || input.includes('iowa state')) {
        return NATHANIEL_DATA.commands.education.output;
    }
    
    if (input.includes('ai') || input.includes('artificial intelligence') || input.includes('machine learning')) {
        return [
            "AI is my current focus area.",
            "",
            "At Sagaciasoft, I build:",
            "→ GenAI-powered chatbots",
            "→ Voice agents using VAPI",
            "→ Multi-agent automation systems",
            "→ AI-integrated web applications",
            "",
            "At Principal Financial, I lead AI adoption",
            "initiatives and think tanks across the org."
        ];
    }
    
    // Default response - suggest AI page
    return [
        `Hmm, I don't have a preset answer for that.`,
        "",
        "Try: help, skills, experience, projects, contact",
        "",
        "Or for deeper questions...",
        '<a href="ai.html" class="terminal-link">→ Talk to Nathaniel\'s AI</a>'
    ];
}

// Terminal button actions
function terminalAction(action) {
    const outputEl = document.getElementById('terminal-output');
    
    switch(action) {
        case 'close':
            // Red button - clear terminal
            outputEl.innerHTML = '';
            showOutput(["Terminal cleared. Type 'help' to get started."]);
            break;
        case 'minimize':
            // Yellow button - show help
            handleCommand('help');
            break;
        case 'expand':
            // Green button - show everything
            showOutput([
                "// Quick Overview",
                "",
                "Name: Nathaniel Young",
                "Role: Solutions Architect & AI Specialist",
                "Experience: 10+ years",
                "Location: Des Moines, IA area",
                "",
                "Current: Principal Financial (Sr. Engineer II)",
                "Side: Sagaciasoft (Founder)",
                "",
                "Education: Iowa State — Computer Engineering",
                "",
                "Notable Companies:",
                "  Microsoft, John Deere, Wellmark, Principal",
                "",
                "Type 'skills' or 'projects' for more!"
            ]);
            break;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

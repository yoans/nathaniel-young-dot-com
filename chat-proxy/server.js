const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Resend email configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Enable CORS for your domain
app.use(cors({
  origin: ['https://nathaniel-young.com', 'https://www.nathaniel-young.com', 'http://localhost:8080'],
  methods: ['POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Chat proxy is running' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { messages, context, messageCount } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Build the conversation with system context
    const conversationMessages = [
      { role: 'system', content: context || 'You are a helpful assistant.' },
      ...messages
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: conversationMessages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return res.status(response.status).json({ error: 'Failed to get response from AI' });
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    res.json({ response: aiMessage });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send conversation email endpoint
app.post('/send-conversation', async (req, res) => {
  try {
    const { messages, metadata } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Format conversation for email
    const conversationHtml = formatConversationHtml(messages, metadata);

    // Send email via Resend
    await resend.emails.send({
      from: process.env.RESEND_FROM || 'AI Chat <noreply@nathaniel-young.com>',
      to: 'contact@nathaniel-young.com',
      subject: `AI Chat Conversation - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      html: conversationHtml
    });

    console.log('Conversation email sent successfully');
    res.json({ success: true, message: 'Conversation sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send conversation email' });
  }
});

// Format conversation as HTML for email
function formatConversationHtml(messages, metadata = {}) {
  const timestamp = new Date().toLocaleString();
  const userAgent = metadata.userAgent || 'Unknown';
  const referrer = metadata.referrer || 'Direct';
  const sessionDuration = metadata.sessionDuration || 'Unknown';

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a2e; color: #00ff88; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .message { padding: 12px 16px; margin: 8px 0; border-radius: 8px; }
        .user { background: #e3f2fd; border-left: 4px solid #2196f3; }
        .assistant { background: #f3e5f5; border-left: 4px solid #9c27b0; }
        .role { font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
        .content { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="margin: 0;">🤖 AI Chat Conversation</h2>
        <p style="margin: 10px 0 0 0; opacity: 0.8;">nathaniel-young.com</p>
      </div>
      <div class="meta">
        <strong>📅 Timestamp:</strong> ${timestamp}<br>
        <strong>💬 Messages:</strong> ${messages.length}<br>
        <strong>⏱️ Session Duration:</strong> ${sessionDuration}<br>
        <strong>🔗 Referrer:</strong> ${referrer}<br>
        <strong>🖥️ User Agent:</strong> ${userAgent}
      </div>
      <h3>Conversation:</h3>
  `;

  for (const msg of messages) {
    const roleClass = msg.role === 'user' ? 'user' : 'assistant';
    const roleLabel = msg.role === 'user' ? '👤 Visitor' : '🤖 Nathaniel\'s AI';
    const escapedContent = msg.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html += `
      <div class="message ${roleClass}">
        <div class="role">${roleLabel}</div>
        <div class="content">${escapedContent}</div>
      </div>
    `;
  }

  html += `
    </body>
    </html>
  `;

  return html;
}

app.listen(PORT, () => {
  console.log(`Chat proxy server running on port ${PORT}`);
});

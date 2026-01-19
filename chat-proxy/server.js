const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your domain
app.use(cors({
  origin: ['https://nathaniel-young.com', 'https://www.nathaniel-young.com', 'http://localhost:8080'],
  methods: ['POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Chat proxy server running on port ${PORT}`);
});

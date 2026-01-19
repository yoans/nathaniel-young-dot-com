# Chat Proxy Server

Simple Express proxy to secure OpenAI API calls for nathaniel-young.com

## Railway Deployment

1. Push this directory to GitHub (can be separate repo or subdirectory)
2. Create new project in Railway
3. Connect GitHub repo
4. Add environment variable: `OPENAI_API_KEY=your-key-here`
5. Set custom domain: `chat-ai.nathaniel-young.com`
6. Railway will auto-detect and deploy

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Auto-set by Railway

## Usage

POST to `/chat` with:
```json
{
  "message": "User's question",
  "context": "System context about Nathaniel"
}
```

Returns:
```json
{
  "response": "AI's response"
}
```

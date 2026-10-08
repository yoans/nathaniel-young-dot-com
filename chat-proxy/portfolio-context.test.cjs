const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Works both from a staging folder and from chat-proxy in the repository.
const root = fs.existsSync(path.join(__dirname, 'ai-terminal.js')) ? __dirname : path.join(__dirname, '..');
const profile = require(path.join(root, 'nathaniel-context.js'));
const source = fs.readFileSync(path.join(root, 'ai-terminal.js'), 'utf8');
function terminal(fetch = () => { throw new Error('Unexpected network call'); }) {
  const sandbox = vm.createContext({
    window: { NATHANIEL_PROFILE: profile, NATE_AI_PROXY_URL: 'https://example.test/chat' },
    document: { addEventListener() {} },
    console, fetch, setTimeout
  });
  vm.runInContext(source, sandbox);
  return sandbox;
}

test('browser and evaluation use the same canonical profile', () => {
  const sandbox = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'nathaniel-context.js'), 'utf8'), sandbox);
  assert.equal(sandbox.NATHANIEL_PROFILE.systemPrompt, profile.systemPrompt);
  const html = fs.readFileSync(path.join(root, 'ai.html'), 'utf8');
  assert.ok(html.indexOf('src="./nathaniel-context.js') < html.indexOf('src="./ai-terminal.js'));
});

test('proxy receives the current user turn once and the shared career profile', async () => {
  let request;
  const sandbox = terminal(async (url, options) => {
    request = { url, ...JSON.parse(options.body) };
    return { ok: true, json: async () => ({ response: 'Test response' }) };
  });
  vm.runInContext("conversationHistory = [{role:'user',content:'Earlier'}, {role:'assistant',content:'Reply'}, {role:'user',content:'Latest'}]", sandbox);
  assert.equal(await sandbox.callOpenAIProxy('Latest'), 'Test response');
  assert.equal(request.context, profile.systemPrompt);
  assert.equal(request.url, 'https://example.test/chat');
  assert.deepEqual(request.messages.map(m => m.content), ['Earlier', 'Reply', 'Latest']);
});

test('direct API path also sends the current user turn once', async () => {
  let request;
  const sandbox = terminal(async (_url, options) => {
    request = JSON.parse(options.body);
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'Test' } }] }) };
  });
  vm.runInContext("conversationHistory = [{role:'user',content:'Latest'}]", sandbox);
  await sandbox.callOpenAI('Latest', 'unit-test-placeholder');
  assert.equal(request.messages.length, 2);
  assert.equal(request.messages[0].content, profile.systemPrompt);
  assert.equal(request.messages[1].content, 'Latest');
});

test('chat renders case study links and emphasis while escaping visitor HTML', () => {
  const { formatAIMessage } = terminal();
  assert.equal(formatAIMessage('**Proof**\n[Story](https://example.test/story?a=1&b=2)'), '<strong>Proof</strong><br><a href="https://example.test/story?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">Story</a>');
  const hostile = formatAIMessage('<img src=x onerror="alert(1)"> [Click](javascript:alert(1))');
  assert.ok(!hostile.includes('<img'));
  assert.ok(!hostile.includes('<a'));
  assert.ok(hostile.includes('&lt;img'));
  const quoted = formatAIMessage('[Link](https://example.test/"onmouseover="alert)');
  assert.ok(!quoted.includes('"onmouseover="'));
});

test('offline role comparison preserves management uncertainty without a fabricated score', () => {
  const { analyzeJobDescriptionLocally } = terminal();
  const output = analyzeJobDescriptionLocally('Head of Engineering: AWS, TypeScript, mentoring, hiring and direct reports');
  assert.match(output, /AWS/);
  assert.match(output, /not documented/);
  assert.doesNotMatch(output, /\d+%|perfect fit/i);
});

test('offline archive responses do not offer retired generation or invent granted patents', () => {
  const { generateLocalResponse } = terminal();
  assert.match(generateLocalResponse('Can I order from Pet Protagonists?'), /retired/i);
  assert.match(generateLocalResponse('Tell me about Varimuse'), /no longer|not pending/i);
  assert.match(generateLocalResponse('Tell me about the flag pole'), /pre-production/i);
});

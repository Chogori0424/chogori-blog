import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { describe, it } from 'node:test';
import publicBotHandler from '../api/bot/public.js';
import {
	buildPublicBotMessages,
	sanitizePublicBotInput,
} from '../src/lib/bot/publicProfile.js';

function createRequest(method, body) {
	const req = Readable.from(body ? [JSON.stringify(body)] : []);
	req.method = method;
	return req;
}

function createResponse() {
	return {
		statusCode: 200,
		headers: {},
		body: '',
		setHeader(name, value) {
			this.headers[name.toLowerCase()] = value;
		},
		end(value = '') {
			this.body = String(value);
		},
		json() {
			return JSON.parse(this.body);
		},
	};
}

async function withEnv(name, value, callback) {
	const previous = process.env[name];
	if (value === undefined) {
		delete process.env[name];
	} else {
		process.env[name] = value;
	}

	try {
		await callback();
	} finally {
		if (previous === undefined) {
			delete process.env[name];
		} else {
			process.env[name] = previous;
		}
	}
}

describe('public bot profile', () => {
	it('sanitizes whitespace and control characters', () => {
		assert.equal(sanitizePublicBotInput('  你好\u0000\r\n帮我回一句  '), '你好\n帮我回一句');
	});

	it('rejects empty messages', () => {
		assert.throws(() => sanitizePublicBotInput('   '), /Message is required/);
	});

	it('rejects messages that are too long', () => {
		assert.throws(() => sanitizePublicBotInput('a'.repeat(2001)), /Message is too long/);
	});

	it('builds public-only messages without private memory wording', () => {
		const messages = buildPublicBotMessages('帮我回一句：今晚不去了');
		const joined = messages.map((message) => message.content).join('\n');

		assert.equal(messages.length, 2);
		assert.equal(messages[0].role, 'system');
		assert.equal(messages[1].role, 'user');
		assert.equal(messages[1].content, '帮我回一句：今晚不去了');
		assert.match(joined, /Chogori Lee/);
		assert.doesNotMatch(joined, /FAISS|RAG|微信|ChatGPT 历史|private memory|raw chat/i);
	});
});

describe('public bot api handler', () => {
	it('rejects non-POST requests', async () => {
		const req = createRequest('GET');
		const res = createResponse();

		await publicBotHandler(req, res);

		assert.equal(res.statusCode, 405);
		assert.equal(res.headers.allow, 'POST');
		assert.equal(res.headers['cache-control'], 'no-store');
		assert.deepEqual(res.json(), { error: 'Method Not Allowed' });
	});

	it('returns a controlled configuration error when API key is missing', async () => {
		await withEnv('OPENAI_API_KEY', undefined, async () => {
			const req = createRequest('POST', { message: '你好' });
			const res = createResponse();

			await publicBotHandler(req, res);

			assert.equal(res.statusCode, 500);
			assert.deepEqual(res.json(), { error: 'Public bot is not configured.' });
		});
	});

	it('rejects empty messages before calling the model', async () => {
		await withEnv('OPENAI_API_KEY', 'test-key', async () => {
			const req = createRequest('POST', { message: '   ' });
			const res = createResponse();

			await publicBotHandler(req, res);

			assert.equal(res.statusCode, 400);
			assert.deepEqual(res.json(), { error: 'Message is required.' });
		});
	});
});

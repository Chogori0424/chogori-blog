import { buildPublicBotMessages } from '../../src/lib/bot/publicProfile.js';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';

function sendJson(res, statusCode, payload) {
	res.statusCode = statusCode;
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store');
	res.end(JSON.stringify(payload));
}

function first(value) {
	return Array.isArray(value) ? value[0] : value;
}

async function readJsonBody(req) {
	const chunks = [];

	for await (const chunk of req) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	const raw = Buffer.concat(chunks).toString('utf8');
	if (!raw.trim()) return {};

	try {
		return JSON.parse(raw);
	} catch {
		throw new Error('Invalid JSON body.');
	}
}

function getOpenAIConfig() {
	const apiKey = process.env.OPENAI_API_KEY;
	const baseUrl = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
	const model = process.env.BOT_PUBLIC_MODEL || process.env.LCX_BOT_MODEL || DEFAULT_MODEL;

	return { apiKey, baseUrl, model };
}

async function createChatCompletion({ apiKey, baseUrl, model, messages }) {
	const response = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model,
			messages,
			temperature: 0.35,
		}),
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(first(payload?.error?.message) || response.statusText || 'Model request failed.');
	}

	const answer = payload?.choices?.[0]?.message?.content;
	if (typeof answer !== 'string' || !answer.trim()) {
		throw new Error('Model returned an empty answer.');
	}

	return answer.trim();
}

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		sendJson(res, 405, { error: 'Method Not Allowed' });
		return;
	}

	const { apiKey, baseUrl, model } = getOpenAIConfig();
	if (!apiKey) {
		sendJson(res, 500, { error: 'Public bot is not configured.' });
		return;
	}

	try {
		const body = await readJsonBody(req);
		const messages = buildPublicBotMessages(body?.message);
		const answer = await createChatCompletion({ apiKey, baseUrl, model, messages });
		sendJson(res, 200, { answer });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Request failed.';
		const statusCode = /Message is required|Message is too long|Invalid JSON/.test(message) ? 400 : 502;
		sendJson(res, statusCode, {
			error: statusCode === 400 ? message : 'Public bot request failed.',
		});
	}
}

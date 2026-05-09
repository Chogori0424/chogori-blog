import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const devlogPath = resolve(rootDir, 'src/data/devlog.json');
const categoryOrder = ['added', 'improved', 'fixed', 'removed', 'docs', 'style'];
const categoryLabels = {
	added: '新增',
	improved: '优化',
	fixed: '修复',
	removed: '删除',
	docs: '文档',
	style: '样式',
};
const typeAliases = {
	add: 'added',
	added: 'added',
	feature: 'added',
	features: 'added',
	improve: 'improved',
	improved: 'improved',
	optimization: 'improved',
	optimize: 'improved',
	deploy: 'improved',
	refactor: 'improved',
	fix: 'fixed',
	fixed: 'fixed',
	bugfix: 'fixed',
	remove: 'removed',
	removed: 'removed',
	delete: 'removed',
	deleted: 'removed',
	doc: 'docs',
	docs: 'docs',
	content: 'docs',
	style: 'style',
	styles: 'style',
};

function parseArgs(argv) {
	const args = {};

	for (let index = 0; index < argv.length; index += 1) {
		const item = argv[index];

		if (item.startsWith('--')) {
			const key = item.slice(2);
			const next = argv[index + 1];

			if (!next || next.startsWith('--')) {
				args[key] = true;
				continue;
			}

			args[key] = next;
			index += 1;
		}
	}

	return args;
}

function getToday() {
	return new Date().toLocaleDateString('sv-SE');
}

function createEmptyItems() {
	return Object.fromEntries(categoryOrder.map((key) => [key, []]));
}

function normalizeType(type) {
	return typeAliases[String(type || '').trim()] || null;
}

function normalizeGroups(data) {
	if (Array.isArray(data) && data.every((group) => group.items)) {
		return data.map((group) => ({
			date: group.date,
			items: mergeGroupItems({
				...createEmptyItems(),
				...group.items,
			}),
		}));
	}

	const groups = new Map();

	for (const entry of data) {
		if (!groups.has(entry.date)) {
			groups.set(entry.date, {
				date: entry.date,
				items: createEmptyItems(),
			});
		}

		const group = groups.get(entry.date);
		const category = normalizeType(entry.type) || 'improved';
		const text = entry.description ? `${entry.title}：${entry.description}` : entry.title;

		if (!group.items[category].includes(text)) {
			group.items[category].push(text);
		}
	}

	return [...groups.values()].sort((a, b) => b.date.localeCompare(a.date));
}

function mergeItems(items) {
	const cleaned = items.map((item) => String(item || '').trim()).filter(Boolean);

	if (cleaned.length <= 1) {
		return cleaned;
	}

	return [cleaned.join('；')];
}

function mergeGroupItems(items) {
	return Object.fromEntries(categoryOrder.map((category) => [category, mergeItems(items[category] || [])]));
}

function readDevlog() {
	return normalizeGroups(JSON.parse(readFileSync(devlogPath, 'utf8')));
}

function writeDevlog(groups) {
	const normalized = groups
		.map((group) => ({
			date: group.date,
			items: mergeGroupItems({
				...createEmptyItems(),
				...group.items,
			}),
		}))
		.sort((a, b) => b.date.localeCompare(a.date));

	writeFileSync(devlogPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
}

function formatItem(title, description) {
	if (!description) return title;
	return `${title}：${description}`;
}

function printLatest(groups, count = 5) {
	for (const group of groups.slice(0, count)) {
		console.log(`${group.date}`);

		for (const category of categoryOrder) {
			const items = group.items[category] || [];
			if (items.length === 0) continue;

			console.log(`  ${categoryLabels[category]}`);
			for (const item of items) {
				console.log(`  - ${item}`);
			}
		}
	}
}

const args = parseArgs(process.argv.slice(2));
const groups = readDevlog();

if (args.latest) {
	printLatest(groups, Number(args.count) || 5);
	process.exit(0);
}

const category = normalizeType(args.type);
const title = String(args.title || '').trim();
const description = String(args.description || '').trim();

if (!category) {
	console.error(`Invalid --type. Use one of: ${Object.keys(typeAliases).join(', ')}`);
	process.exit(1);
}

if (!title) {
	console.error('Missing required argument: --title');
	process.exit(1);
}

const date = String(args.date || getToday()).trim();
const item = formatItem(title, description);
let group = groups.find((entry) => entry.date === date);

if (!group) {
	group = {
		date,
		items: createEmptyItems(),
	};
	groups.unshift(group);
}

if (Object.values(group.items).some((items) => items.some((existing) => existing.includes(title)))) {
	console.log(`Skipped duplicate changelog item: ${title}`);
	process.exit(0);
}

if (group.items[category].length > 0) {
	group.items[category] = mergeItems([...group.items[category], item]);
} else {
	group.items[category].push(item);
}
writeDevlog(groups);
console.log(`Added changelog item: ${date} ${categoryLabels[category]} - ${title}`);

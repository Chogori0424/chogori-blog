import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const devlogPath = resolve(rootDir, 'src/data/devlog.json');
const allowedTypes = new Set(['feature', 'fix', 'style', 'content', 'deploy', 'refactor']);

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

function getCurrentCommit() {
	try {
		return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
			cwd: rootDir,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
	} catch {
		return null;
	}
}

function readDevlog() {
	return JSON.parse(readFileSync(devlogPath, 'utf8'));
}

function writeDevlog(entries) {
	writeFileSync(devlogPath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
}

function printLatest(entries, count = 5) {
	const latest = [...entries]
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, count);

	for (const entry of latest) {
		const commit = entry.commit ? ` (${entry.commit})` : '';
		const tags = entry.tags?.length ? ` [${entry.tags.join(', ')}]` : '';
		console.log(`${entry.date} ${entry.type}: ${entry.title}${commit}${tags}`);
	}
}

const args = parseArgs(process.argv.slice(2));
const entries = readDevlog();

if (args.latest) {
	printLatest(entries, Number(args.count) || 5);
	process.exit(0);
}

const type = String(args.type || '').trim();
const title = String(args.title || '').trim();
const description = String(args.description || '').trim();
const tags = String(args.tags || '')
	.split(',')
	.map((tag) => tag.trim())
	.filter(Boolean);

if (!allowedTypes.has(type)) {
	console.error(`Invalid --type. Use one of: ${[...allowedTypes].join(', ')}`);
	process.exit(1);
}

if (!title || !description) {
	console.error('Missing required arguments: --title and --description');
	process.exit(1);
}

if (entries.some((entry) => entry.title === title)) {
	console.log(`Skipped duplicate devlog title: ${title}`);
	process.exit(0);
}

entries.unshift({
	date: getToday(),
	type,
	title,
	description,
	commit: getCurrentCommit(),
	tags,
});

writeDevlog(entries);
console.log(`Added devlog entry: ${title}`);

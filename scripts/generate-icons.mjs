import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = 'public/images/avatar.webp';
const zoom = 1.08;

function circleMask(size) {
	const radius = size / 2 - 0.35;
	return Buffer.from(
		`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="#fff"/></svg>`,
	);
}

async function renderCircularIcon(size) {
	const enlarged = Math.ceil(size * zoom);
	const offset = Math.floor((enlarged - size) / 2);

	return sharp(source)
		.resize(enlarged, enlarged, { fit: 'cover', position: 'center' })
		.extract({ left: offset, top: offset, width: size, height: size })
		.ensureAlpha()
		.composite([{ input: circleMask(size), blend: 'dest-in' }])
		.png({ compressionLevel: 9, adaptiveFiltering: true })
		.toBuffer();
}

function makeIco(images) {
	const headerSize = 6;
	const entrySize = 16;
	const directorySize = headerSize + entrySize * images.length;
	let imageOffset = directorySize;
	const header = Buffer.alloc(directorySize);

	header.writeUInt16LE(0, 0);
	header.writeUInt16LE(1, 2);
	header.writeUInt16LE(images.length, 4);

	for (const [index, image] of images.entries()) {
		const entryOffset = headerSize + entrySize * index;
		header.writeUInt8(image.size >= 256 ? 0 : image.size, entryOffset);
		header.writeUInt8(image.size >= 256 ? 0 : image.size, entryOffset + 1);
		header.writeUInt8(0, entryOffset + 2);
		header.writeUInt8(0, entryOffset + 3);
		header.writeUInt16LE(1, entryOffset + 4);
		header.writeUInt16LE(32, entryOffset + 6);
		header.writeUInt32LE(image.buffer.length, entryOffset + 8);
		header.writeUInt32LE(imageOffset, entryOffset + 12);
		imageOffset += image.buffer.length;
	}

	return Buffer.concat([header, ...images.map((image) => image.buffer)]);
}

const iconSizes = [
	['public/favicon-16x16.png', 16],
	['public/favicon-32x32.png', 32],
	['public/apple-touch-icon.png', 180],
	['public/android-chrome-192x192.png', 192],
	['public/android-chrome-512x512.png', 512],
];

const rendered = new Map();
for (const [path, size] of iconSizes) {
	const buffer = await renderCircularIcon(size);
	rendered.set(size, buffer);
	await writeFile(path, buffer);
}

const favicon48 = await renderCircularIcon(48);
await writeFile(
	'public/favicon.ico',
	makeIco([
		{ size: 16, buffer: rendered.get(16) },
		{ size: 32, buffer: rendered.get(32) },
		{ size: 48, buffer: favicon48 },
	]),
);

const svgPng = rendered.get(192).toString('base64');
await writeFile(
	'public/favicon.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image href="data:image/png;base64,${svgPng}" width="512" height="512"/></svg>\n`,
);

console.log('Generated circular favicon, Apple touch, and PWA icon assets.');

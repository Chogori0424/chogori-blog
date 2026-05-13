import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const sourceImage = 'scripts/assets/avatar-source.png';
const avatarPath = 'public/images/avatar.webp';
const faviconZoom = 1.08;
const shortcutBackground = '#0f172a';
const shortcutPortraitScale = 1.18;

function circleMask(size) {
	const radius = size / 2 - 0.35;
	return Buffer.from(
		`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="#fff"/></svg>`,
	);
}

function isCheckerPixel(r, g, b) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	return r >= 224 && g >= 224 && b >= 224 && max - min <= 18;
}

async function createTransparentAvatar() {
	const { data, info } = await sharp(sourceImage)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const { width, height } = info;
	const background = new Uint8Array(width * height);
	const queue = [];

	function visit(x, y) {
		if (x < 0 || y < 0 || x >= width || y >= height) return;

		const index = y * width + x;
		if (background[index]) return;

		const offset = index * 4;
		if (!isCheckerPixel(data[offset], data[offset + 1], data[offset + 2])) return;

		background[index] = 1;
		queue.push(index);
	}

	for (let x = 0; x < width; x++) {
		visit(x, 0);
		visit(x, height - 1);
	}
	for (let y = 0; y < height; y++) {
		visit(0, y);
		visit(width - 1, y);
	}

	for (let head = 0; head < queue.length; head++) {
		const index = queue[head];
		const x = index % width;
		const y = Math.floor(index / width);
		visit(x + 1, y);
		visit(x - 1, y);
		visit(x, y + 1);
		visit(x, y - 1);
	}

	const output = Buffer.from(data);
	for (let index = 0; index < background.length; index++) {
		if (background[index]) output[index * 4 + 3] = 0;
	}

	await sharp(output, { raw: { width, height, channels: 4 } })
		.resize(640, 640, { fit: 'cover', position: 'center' })
		.webp({ quality: 92, effort: 6, alphaQuality: 100 })
		.toFile(avatarPath);
}

async function renderCircularFavicon(size) {
	const enlarged = Math.ceil(size * faviconZoom);
	const offset = Math.floor((enlarged - size) / 2);

	return sharp(avatarPath)
		.resize(enlarged, enlarged, { fit: 'cover', position: 'center' })
		.extract({ left: offset, top: offset, width: size, height: size })
		.ensureAlpha()
		.composite([{ input: circleMask(size), blend: 'dest-in' }])
		.png({ compressionLevel: 9, adaptiveFiltering: true })
		.toBuffer();
}

async function renderShortcutIcon(size) {
	const portraitSize = Math.round(size * shortcutPortraitScale);
	const offset = Math.floor((portraitSize - size) / 2);
	const portrait = await sharp(avatarPath)
		.resize(portraitSize, portraitSize, { fit: 'cover', position: 'center' })
		.extract({ left: offset, top: offset, width: size, height: size })
		.ensureAlpha()
		.png()
		.toBuffer();

	return sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background: shortcutBackground,
		},
	})
		.composite([{ input: portrait, left: 0, top: 0 }])
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

const faviconSizes = [
	['public/favicon-16x16.png', 16],
	['public/favicon-32x32.png', 32],
];

const shortcutSizes = [
	['public/apple-touch-icon.png', 180],
	['public/android-chrome-192x192.png', 192],
	['public/android-chrome-512x512.png', 512],
];

await createTransparentAvatar();

const renderedFavicons = new Map();
for (const [path, size] of faviconSizes) {
	const buffer = await renderCircularFavicon(size);
	renderedFavicons.set(size, buffer);
	await writeFile(path, buffer);
}

for (const [path, size] of shortcutSizes) {
	await writeFile(path, await renderShortcutIcon(size));
}

const favicon48 = await renderCircularFavicon(48);
await writeFile(
	'public/favicon.ico',
	makeIco([
		{ size: 16, buffer: renderedFavicons.get(16) },
		{ size: 32, buffer: renderedFavicons.get(32) },
		{ size: 48, buffer: favicon48 },
	]),
);

const svgPng = (await renderCircularFavicon(192)).toString('base64');
await writeFile(
	'public/favicon.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image href="data:image/png;base64,${svgPng}" width="512" height="512"/></svg>\n`,
);

console.log('Generated circular favicon, Apple touch, and PWA icon assets.');

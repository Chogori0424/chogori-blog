// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://chogori.xyz',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			// 代码高亮跟随站点深浅色：浅色主题写在行内颜色里，暗色主题通过 --shiki-dark 变量切换
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			langAlias: {
				surge: 'ini',
			},
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});

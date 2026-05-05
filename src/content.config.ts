import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			category: z.enum(['网络代理', '工程制造', '音频设备', '个人日志']),
			tags: z.array(z.string()).default([]),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.preprocess(
				(value) => (value === '' ? undefined : value),
				z.union([image(), z.string().min(1)]).optional(),
			),
		}),
});

export const collections = { blog };

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thinking = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thinking' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    lang: z.string().default("fr"),
    cartouche: z.array(z.object({ l: z.string(), v: z.string() })).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { thinking };

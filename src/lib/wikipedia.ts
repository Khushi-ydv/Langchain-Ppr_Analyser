'use server';

import { z } from 'zod';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

const extractSchema = z.object({
    batchcomplete: z.string().optional(),
    query: z.object({
        pages: z.record(z.object({
            pageid: z.number(),
            ns: z.number(),
            title: z.string(),
            extract: z.string(),
        }))
    })
});


export async function getWikipediaArticle(title: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    titles: title,
    explaintext: 'true',
    format: 'json',
    utf8: '1',
  });

  try {
    const response = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`);
    if (!response.ok) {
      console.error('Failed to fetch article from Wikipedia', response.statusText);
      return null;
    }
    const data = await response.json();
    const parsed = extractSchema.safeParse(data);
    if (!parsed.success) {
        console.error('Failed to parse Wikipedia extract response', parsed.error);
        return null;
    }
    const pages = parsed.data.query.pages;
    const page = Object.values(pages)[0];
    return page && page.extract ? page.extract : null;
  } catch (error) {
    console.error('Error fetching article from Wikipedia:', error);
    return null;
  }
}

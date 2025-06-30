'use server';

/**
 * @fileOverview A Wikipedia article summarization AI agent.
 *
 * - summarizeWikipediaArticle - A function that handles the article summarization process.
 * - SummarizeWikipediaArticleInput - The input type for the summarizeWikipediaArticle function.
 * - SummarizeWikipediaArticleOutput - The return type for the summarizeWikipediaArticle function.
 */

import {ai} from '@/ai/genkit';
import {
    SummarizeWikipediaArticleInputSchema,
    SummarizeWikipediaArticleOutputSchema,
    summarizeWikipediaArticlePromptTemplate,
    type SummarizeWikipediaArticleInput,
    type SummarizeWikipediaArticleOutput
} from '@/ai/prompts';

export { type SummarizeWikipediaArticleInput, type SummarizeWikipediaArticleOutput };

export async function summarizeWikipediaArticle(
  input: SummarizeWikipediaArticleInput
): Promise<SummarizeWikipediaArticleOutput> {
  return summarizeWikipediaArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWikipediaArticlePrompt',
  input: {schema: SummarizeWikipediaArticleInputSchema},
  output: {schema: SummarizeWikipediaArticleOutputSchema},
  prompt: summarizeWikipediaArticlePromptTemplate,
});

const summarizeWikipediaArticleFlow = ai.defineFlow(
  {
    name: 'summarizeWikipediaArticleFlow',
    inputSchema: SummarizeWikipediaArticleInputSchema,
    outputSchema: SummarizeWikipediaArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

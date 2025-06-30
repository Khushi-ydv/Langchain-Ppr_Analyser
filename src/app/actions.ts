'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

import {
  answerFactBasedQuestions,
  type AnswerFactBasedQuestionsOutput,
} from '@/ai/flows/answer-fact-based-questions';
import {
  summarizeWikipediaArticle,
  type SummarizeWikipediaArticleOutput,
} from '@/ai/flows/summarize-wikipedia-article';
import * as prompts from '@/ai/prompts';
import { getWikipediaArticle } from '@/lib/wikipedia';


async function generateWithApiKey<InputType, OutputType>(
  apiKey: string,
  promptTemplate: string,
  input: InputType,
  outputSchema: z.ZodType<OutputType>
): Promise<OutputType> {
  const customAi = genkit({
      plugins: [googleAI({ apiKey })],
      model: 'googleai/gemini-2.0-flash',
  });

  const tempPrompt = customAi.definePrompt({
      name: `adhoc_${crypto.randomUUID()}`,
      prompt: promptTemplate,
      input: { schema: z.any() },
      output: { schema: outputSchema },
  });

  const { output } = await tempPrompt(input);
  return output!;
}


export async function loadArticle(url: string, apiKey?: string) {
    try {
        const urlSchema = z.string().url().refine(val => val.startsWith('https://en.wikipedia.org/wiki/'), {
            message: 'Please provide a valid English Wikipedia article URL.'
        });

        const validation = urlSchema.safeParse(url);
        if (!validation.success) {
            return { success: false, error: validation.error.errors[0].message };
        }

        const articleTitle = decodeURIComponent(url.split('/wiki/')[1]);
        const articleContent = await getWikipediaArticle(articleTitle);

        if (!articleContent) {
            return { success: false, error: `Could not fetch content for "${articleTitle.replace(/_/g, ' ')}".` };
        }
        
        const summaryInput = { articleContent };
        let summaryResult: SummarizeWikipediaArticleOutput;

        if (apiKey) {
            summaryResult = await generateWithApiKey(
                apiKey,
                prompts.summarizeWikipediaArticlePromptTemplate,
                summaryInput,
                prompts.SummarizeWikipediaArticleOutputSchema
            );
        } else {
            summaryResult = await summarizeWikipediaArticle(summaryInput);
        }
        
        return {
            success: true,
            title: articleTitle.replace(/_/g, ' '),
            content: articleContent,
            summary: summaryResult.summary,
            url
        };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'An unexpected error occurred while loading the article.' };
    }
}


const querySchema = z.object({
  query: z.string().min(1, 'Please enter a question.'),
  articleContent: z.string().min(1),
  articleLink: z.string().url(),
  apiKey: z.string().optional(),
});

export type AIResponse = {
    id: string;
    role: 'assistant';
    content: string;
    source?: string;
    error?: string;
}

export async function submitQuery(prevState: any, formData: FormData): Promise<AIResponse> {
    const parsedQuery = querySchema.safeParse({
        query: formData.get('query'),
        articleContent: formData.get('articleContent'),
        articleLink: formData.get('articleLink'),
        apiKey: formData.get('apiKey') || undefined,
    });

    if (!parsedQuery.success) {
        return {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            error: parsedQuery.error.errors[0].message,
        };
    }

    const { query, articleContent, articleLink, apiKey } = parsedQuery.data;
    const id = crypto.randomUUID();
    const queryInput = { query, articleContent, articleLink };

    try {
        let result: AnswerFactBasedQuestionsOutput;

        if (apiKey) {
            result = await generateWithApiKey(
                apiKey,
                prompts.answerFactBasedQuestionsPromptTemplate,
                queryInput,
                prompts.AnswerFactBasedQuestionsOutputSchema
            );
        } else {
            result = await answerFactBasedQuestions(queryInput);
        }

        return {
            id,
            role: 'assistant',
            content: result.answer,
            source: result.source,
        };
        
    } catch (error) {
        console.error('Error processing query:', error);
        return {
            id,
            role: 'assistant',
            content: '',
            error: 'An unexpected error occurred. Please try again.',
        };
    }
}

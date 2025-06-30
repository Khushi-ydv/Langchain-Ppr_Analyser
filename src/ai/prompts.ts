import {z} from 'genkit';

export const SummarizeWikipediaArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the Wikipedia article to summarize.'),
});
export type SummarizeWikipediaArticleInput = z.infer<typeof SummarizeWikipediaArticleInputSchema>;

export const SummarizeWikipediaArticleOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the Wikipedia article.'),
});
export type SummarizeWikipediaArticleOutput = z.infer<typeof SummarizeWikipediaArticleOutputSchema>;

export const summarizeWikipediaArticlePromptTemplate = `You are an expert summarizer of Wikipedia articles. Summarize the following article content in a concise and informative way.

Article Content: {{{articleContent}}}`;


export const AnswerFactBasedQuestionsInputSchema = z.object({
  query: z.string().describe('The question to be answered using Wikipedia content.'),
  articleLink: z.string().optional().describe('Optional: A link to the Wikipedia article to use as context.'),
  articleContent: z.string().optional().describe('Optional: The content of the Wikipedia article to answer the question.'),
});
export type AnswerFactBasedQuestionsInput = z.infer<typeof AnswerFactBasedQuestionsInputSchema>;

export const AnswerFactBasedQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, based on Wikipedia content.'),
  source: z.string().optional().describe('A direct link to the Wikipedia article or section used to answer the question.'),
});
export type AnswerFactBasedQuestionsOutput = z.infer<typeof AnswerFactBasedQuestionsOutputSchema>;

export const answerFactBasedQuestionsPromptTemplate = `You are a fact-checking bot that answers fact-based questions using Wikipedia content. 

Answer the following question: {{{query}}}.

Use the following Wikipedia article content to answer the question:
{{{articleContent}}}

If the question cannot be answered using the provided content, respond that you cannot answer the question. Include a link to the specific section of the Wikipedia article used to answer the question in the source field. If no link is available, use the articleLink, if it is available.
`;

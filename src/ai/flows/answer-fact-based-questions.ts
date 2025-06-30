'use server';

/**
 * @fileOverview Implements the answerFactBasedQuestions flow to answer user questions based on Wikipedia content.
 *
 * - answerFactBasedQuestions - A function that processes user questions and returns accurate answers with citations from Wikipedia.
 * - AnswerFactBasedQuestionsInput - The input type for the answerFactBasedQuestions function.
 * - AnswerFactBasedQuestionsOutput - The return type for the answerFactBasedQuestions function.
 */

import {ai} from '@/ai/genkit';
import {
    AnswerFactBasedQuestionsInputSchema,
    AnswerFactBasedQuestionsOutputSchema,
    answerFactBasedQuestionsPromptTemplate,
    type AnswerFactBasedQuestionsInput,
    type AnswerFactBasedQuestionsOutput
} from '@/ai/prompts';

export { type AnswerFactBasedQuestionsInput, type AnswerFactBasedQuestionsOutput };


export async function answerFactBasedQuestions(input: AnswerFactBasedQuestionsInput): Promise<AnswerFactBasedQuestionsOutput> {
  return answerFactBasedQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFactBasedQuestionsPrompt',
  input: {schema: AnswerFactBasedQuestionsInputSchema},
  output: {schema: AnswerFactBasedQuestionsOutputSchema},
  prompt: answerFactBasedQuestionsPromptTemplate,
});

const answerFactBasedQuestionsFlow = ai.defineFlow(
  {
    name: 'answerFactBasedQuestionsFlow',
    inputSchema: AnswerFactBasedQuestionsInputSchema,
    outputSchema: AnswerFactBasedQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

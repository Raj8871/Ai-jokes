'use server';
/**
 * @fileOverview AI flow for generating jokes or Shayari.
 *
 * - generateContent - A function that generates content (joke or Shayari) based on input.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'zod'; // Use zod from the root level as per genkit examples

const GenerateContentInputSchema = z.object({
  language: z.enum(['en', 'hi']).describe('The language for the generated content (English or Hindi).'),
  type: z.enum(['joke', 'shayari']).describe('The type of content to generate (joke or Shayari).'),
  prompt: z.string().describe('The category, keyword, or theme for the content.'),
  length: z.number().min(2).max(5).optional().describe('The desired number of lines for the joke (2-5). Only applicable if type is "joke".'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  generatedText: z.string().describe('The generated joke or Shayari text.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

// Define the prompt for Genkit
const generateContentPrompt = ai.definePrompt(
    {
        name: 'generateContentPrompt',
        input: { schema: GenerateContentInputSchema },
        output: { schema: GenerateContentOutputSchema },
        prompt: `
        Generate a short {{type}} in {{language}} based on the following theme/keyword: "{{prompt}}".

        Guidelines:
        - If the type is "joke", make it funny and concise. {{#if length}}The joke should be exactly {{length}} lines long.{{/if}}
        - If the type is "shayari", make it thoughtful or emotional, fitting the theme.
        - Keep the text relatively short, suitable for sharing.
        - Output only the {{type}} text itself.
        - Respond in {{language}}. For Hindi, use Devanagari script.
        - Example for Hindi Shayari on "love": तुम्हारी आँखों में खो गया हूँ, ये कैसी मोहब्बत हो गयी है।
        - Example for English Joke on "cat": Why are cats such bad poker players? They always have a fur ace up their sleeve!
        - Example for English 2-line joke on "dog": What do you call a dog magician? A labracadabrador. It's a ruff trick!
        `,
        // Example config (optional, adjust as needed)
        config: {
         temperature: 0.8, // Higher temperature for more creative responses
         maxOutputTokens: 150,
        },
    }
);


// Define the flow using the prompt
const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const llmResponse = await generateContentPrompt(input);
    const output = llmResponse.output;

    if (!output?.generatedText) {
        // Throw an error or return a default message if generation fails
        throw new Error('AI failed to generate content.');
        // Or return a fallback:
        // return { generatedText: input.language === 'hi' ? 'क्षमा करें, सामग्री उत्पन्न करने में असमर्थ।' : 'Sorry, unable to generate content.' };
    }

    return output;
  }
);


// Exported wrapper function to be called from the frontend
export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

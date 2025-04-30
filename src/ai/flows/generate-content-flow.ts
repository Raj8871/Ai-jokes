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
  // Updated length constraint to be between 4 and 7 lines, optional
  length: z.number().min(4).max(7).optional().describe('The desired number of lines (4-7).'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  generatedText: z.string().describe('The generated joke or Shayari text, including relevant emojis.'), // Updated description
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
        - Make it concise and suitable for sharing.
        - Include 1-3 relevant emojis within the text to enhance the mood or context. 🥳
        {{#if length}}
        - The {{type}} must be exactly {{length}} lines long.
        {{else}}
        - Keep the text relatively short.
        {{/if}}
        - If the type is "joke", make it funny. 😂
        - If the type is "shayari", make it thoughtful or emotional, fitting the theme. ❤️✨
        - Output only the {{type}} text itself, including the emojis.
        - Respond in {{language}}. For Hindi, use Devanagari script and appropriate Hindi emojis. नमस्ते 🙏

        Examples (Hindi Shayari):
        - Love (4 lines):
            तुम्हारी आँखों में खो गया हूँ, 😍
            ये कैसी मोहब्बत हो गयी है।
            दिल बस तुम्हें ही चाहता है, ❤️
            क्या यही दीवानगी सही है? ✨
        - Friendship (7 lines):
            दोस्ती का रिश्ता अनोखा है,🤝
            हर पल नया एक धोखा है।
            पर तुझ जैसा यार मिला, 😊
            जैसे किस्मत का झोंका है।
            हर मुश्किल आसान लगे, 💪
            जब तेरा साथ होता है,
            ये दोस्ती सलामत रहे सदा। 🙏🌟

        Examples (English Joke):
        - Cat (4 lines):
            Why are cats such bad poker players? 🤔
            They always have a fur ace up their sleeve! 🐈
            Plus, they get distracted by the laser pointer 🔴
            Under the table. 😂
        - Computer (7 lines):
            Why did the computer keep sneezing? 🤧
            It had a virus! 💻🦠
            Not just any virus, mind you,
            A particularly nasty one. 😨
            It messed up the hard drive,
            Corrupted the files, you see. 💾➡️🗑️
            Bless you, PC! 🙏😂
        `,
        // Example config (optional, adjust as needed)
        config: {
         temperature: 0.8, // Higher temperature for more creative responses
         maxOutputTokens: 300, // Increased token limit slightly for potentially longer jokes/shayari
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
    // Pass the input directly, the prompt handles the optional length
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

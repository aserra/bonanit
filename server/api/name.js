import { streamText, StreamingTextResponse } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  const isDebug = useRuntimeConfig().isDebug;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = createOpenAI({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event) => {
    // Extract the body of the request
    const body = await readBody(event);

    // Extract parameters from the body
    const { personaje } = body;
    console.log(personaje);

    const language = 'Spanish';
    const prompt = `
    Haz un nombre para el animal que sea ${personaje}.
    Si conoces algun animal de algun cuento o de alguna pelicula, no lo utilices. Sé original.
    `;
    
    // Ask OpenAI for a streaming chat completion given the prompt
    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: `Don't say greetings, just only the name without dots.`,
      prompt: prompt,
      temperature: 0.75,
      frequencyPenalty: 1,
    });

    return new StreamingTextResponse(textStream);
  });
});

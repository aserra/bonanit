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
    const { charactersExcluded } = body;
    console.log('charactersExcluded', charactersExcluded);
    
    const language = 'Spanish';

    const prompt = `
    Genera un personaje para un cuento infantil en ${ language }.
    Devuelve un esquema JSON con:
    {
      "nombre": "nombre del personaje",
      "personaje": "tipo de personaje",
      "rol": "Una característica que lo defina, por ejemplo: valiente, amigable, etc."
    }
    El personaje no puede ser ninguno de estos: ${charactersExcluded.join(', ')}.
    `;

    // Ask OpenAI for a streaming chat completion given the prompt
    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: `Makes responses in JSON format. Just respond the JSON without making any introduction or greetings or puntuation marks or dots.`,
      prompt: prompt,
      temperature: 0.75,
      frequencyPenalty: 1,
    });

    return new StreamingTextResponse(textStream);
  });
});

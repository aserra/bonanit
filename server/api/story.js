import { streamText, StreamingTextResponse } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = createOpenAI({
    apiKey: apiKey,
  });

  return defineEventHandler(async (event) => {
    // Extract the body of the request
    const body = await readBody(event);

    // Extract parameters from the body
    const { personajes, moralejas, estilos } = body;

    const language = 'Spanish';

    // Construct the prompt using the extracted parameters
    const selectedPersonajes = personajes.map(p => `${p.nombre} (${p.personaje}, ${p.rol})`).join(', ');
    const selectedMoralejas = moralejas.join(', ');
    const selectedEstilos = estilos.join(', ');

    console.log(`personajes: ${selectedPersonajes}`);
    console.log(`moralejas: ${selectedMoralejas}`);
    console.log(`estilos: ${selectedEstilos}`);

    const prompt = `Escríbeme un cuento infantil en ${language} con los siguientes personajes: ${selectedPersonajes}. 
    La moraleja del cuento debe ser sobre: ${selectedMoralejas}. 
    El estilo del cuento debe ser similar a: ${selectedEstilos}. 
    No más de 250 caracteres.`;

    // Ask OpenAI for a streaming chat completion given the prompt
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: `You are an author who writes short stories for children in ${language}. 
      Don't say greetings, just respond.`,
      prompt: prompt,
      temperature: 0.75,
      frequencyPenalty: 1,
    });

    // Convert the response into a friendly text-stream
    const stream = result.toAIStream({
      onFinal(_) {},
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
  });
});

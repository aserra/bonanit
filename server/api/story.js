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
    const { personajes, moralejas, estilos } = body;
    console.log(personajes);

    const language = 'Spanish';

    // Construct the prompt using the extracted parameters
    const selectedPersonajes = personajes.map(p => `${p.nombre} (${p.personaje}, ${p.rol})`).join(', ');
    const selectedMoralejas = moralejas.join(', ');
    const selectedEstilos = estilos.join(', ');

    console.log('DEBUG - Story request:', isDebug);
    console.log(`language: ${language}`);
    console.log(`personajes: ${selectedPersonajes}`);
    console.log(`moralejas: ${selectedMoralejas}`);
    console.log(`estilos: ${selectedEstilos}`);

    
    const prompt = `
    Cada noche le cuento a mi hija un cuento antes de dormir.
    Escríbeme una historia corta para niños en ${ language }
    Le gustan las pelotas y los animales.
    Deben aparecer los siguientes personajes:  ${selectedPersonajes}.
    Debe ser una historia alegre, diverta, con dialogos y moraleja final.
    La moraleja del cuento debe ser sobre: ${selectedMoralejas}. 
    El estilo del cuento debe ser similar a: ${selectedEstilos}. 
    La historia debe terminar con alguna rima por ejemplo: "colorín colorado, este cuento se ha acabado".
    La historia debe tener un mínimo de 200 palabras.
    La historia debe ser original y no copiada de internet.
    La historia debe ser apropiada para niños de 5 años.
    La historia debe ser escrita en un lenguaje sencillo y fácil de entender.
    La historia debe ser escrita en un lenguaje amigable y cercano.
    La historia debe ser escrita en un lenguaje que fomente la imaginación y la creatividad.
    `;
    
   /*
    const prompt = `Haz una frase con los siguientes personajes:  ${selectedPersonajes}.
    La moraleja del cuento debe ser sobre: ${selectedMoralejas}.
    El estilo del cuento debe ser similar a: ${selectedEstilos}.
    `;
    */

    // Ask OpenAI for a streaming chat completion given the prompt
    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      system: `You are an author who writes short stories for children in ${ language }. 
      Don't say greetings, just respond.`,
      prompt: prompt,
      temperature: 0.75,
      frequencyPenalty: 1,
    });

    return new StreamingTextResponse(textStream);

    // Convert the response into a friendly text-stream
    /*
    const stream = result.toAIStream({
      onFinal(_) {},
    });
    */

    // Respond with the stream
    // return new StreamingTextResponse(stream);

    // const streamingResponse = new StreamingTextResponse(stream)
    // return await streamingResponse.text()
    var text = '';
    for await (const textPart of textStream) {
      text += textPart;
    }

    return text;
  });
});

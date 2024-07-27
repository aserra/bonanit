<script setup>
import { ref } from 'vue';
import personajesData from '~/assets/personajes.json'; // Importa el JSON directament

const text = ref('');

const personajes = ref(
  personajesData.reduce((acc, curr) => {
    acc[curr.nombre.toLowerCase()] = false;
    return acc;
  }, {})
);

const moralejas = ref({
  envidia: false,
  soberbia: false,
  pereza: false,
  avaricia: false,
  lujuria: false
});

const estilos = ref({
  disney: false,
  larryDavid: false,
  mrBean: false
});

const streamDecoder = (encoded) => {
  const regex = /"([^"]*)"/g;
  let match;
  let result = '';

  while ((match = regex.exec(encoded)) !== null) {
    result += match[1];
  }

  console.log(result);
  return result;
};

const handleSubmit = async (event) => {
  console.log('handleSubmit');
  event.preventDefault();

  const selectedPersonajes = personajesData.filter(
    personaje => personajes.value[personaje.nombre.toLowerCase()]
  );

  const selectedMoralejas = Object.keys(moralejas.value).filter(
    key => moralejas.value[key]
  );

  const selectedEstilos = Object.keys(estilos.value).filter(
    key => estilos.value[key]
  );

  const response = await fetch('/api/story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personajes: selectedPersonajes,
      moralejas: selectedMoralejas,
      estilos: selectedEstilos
    }),
  });

  if (!response.body) {
    console.error('No response body');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  text.value = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    console.log('chunk', chunk);
    text.value += streamDecoder(chunk);
  }
};
</script>

<template>
  <div class="max-w-xl mx-auto py-20">
    <form @submit="handleSubmit">
      <h1 class="pb-4 text-xl font-bold text-white-900 md:text-xl">
        Buenas noches <em>baby</em>!
      </h1>
      
      <fieldset class="mb-3">
        <legend class="text-lg font-bold">Personajes</legend>
        <div v-for="personaje in personajesData" :key="personaje.nombre">
          <Checkbox v-model="personajes[personaje.nombre.toLowerCase()]" :id="personaje.nombre.toLowerCase()">
            {{ personaje.nombre }} ({{ personaje.personaje }}, {{ personaje.rol }})
          </Checkbox>
        </div>
      </fieldset>
      
      <fieldset class="mb-3">
        <legend class="text-lg font-bold">Moraleja</legend>
        <Checkbox v-model="moralejas.envidia" id="envidia">Envidia</Checkbox>
        <Checkbox v-model="moralejas.soberbia" id="soberbia">Soberbia</Checkbox>
        <Checkbox v-model="moralejas.pereza" id="pereza">Pereza</Checkbox>
        <Checkbox v-model="moralejas.avaricia" id="avaricia">Avaricia</Checkbox>
        <Checkbox v-model="moralejas.lujuria" id="lujuria">Lujuria</Checkbox>
      </fieldset>

      <fieldset class="mb-3">
        <legend class="text-lg font-bold">Estilo</legend>
        <Checkbox v-model="estilos.disney" id="disney">Disney</Checkbox>
        <Checkbox v-model="estilos.larryDavid" id="larryDavid">Larry David</Checkbox>
        <Checkbox v-model="estilos.mrBean" id="mrBean">Mr Bean</Checkbox>
      </fieldset>

      <hr class="my-4 border-none" />
      <button type="submit" class="btn-magic">
        Haz un cuento!
      </button>
    </form>
    <section id="response" v-if="text">
      <h5 class="text-lg font-bold">Response:</h5>
      <pre class="bg-red">{{ text }}</pre>
    </section>
  </div>
</template>

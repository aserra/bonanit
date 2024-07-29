<script setup>
import { ref } from 'vue';
import personajesData from '~/assets/personajes.json'; // Importa el JSON directament
import CheckboxPersonaje from '~/components/CheckboxPersonaje.vue';

const text = ref("");

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
  <div class="max-w-xl mx-auto py-4 px-4">
    <form v-if="!text" @submit="handleSubmit">

      <h1 class="pb-6 text-xl font-bold text-white-900 md:text-xl">
        Buenas noches <em>baby</em>!
      </h1>
      
      <fieldset class="mb-6 pt-3">
        <legend class="text-slate-200 font-semibold">Personajes</legend>
        <div id="chars__list" class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <CheckboxPersonaje v-for="personaje in personajesData" :key="personaje.nombre" v-model="personajes[personaje.nombre.toLowerCase()]" :id="personaje.nombre.toLowerCase()" :personaje="personaje" />
        </div>
      </fieldset>
      
      <fieldset class="mb-6 pt-3">
        <legend class="text-slate-200 font-semibold">Moraleja</legend>
        <div class="grid grid-cols-3 gap-3">
          <Checkbox v-model="moralejas.envidia" id="envidia">Envidia</Checkbox>
          <Checkbox v-model="moralejas.soberbia" id="soberbia">Soberbia</Checkbox>
          <Checkbox v-model="moralejas.pereza" id="pereza">Pereza</Checkbox>
          <Checkbox v-model="moralejas.avaricia" id="avaricia">Avaricia</Checkbox>
          <Checkbox v-model="moralejas.lujuria" id="lujuria">Lujuria</Checkbox>
        </div>
      </fieldset>

      <fieldset class="mb-6 pt-3">
        <legend class="text-slate-200 font-semibold">Estilo</legend>
        <div class="grid grid-cols-3 gap-3">
          <Checkbox v-model="estilos.disney" id="disney">Disney</Checkbox>
          <Checkbox v-model="estilos.larryDavid" id="larryDavid">Larry David</Checkbox>
          <Checkbox v-model="estilos.verso" id="verso">En Verso</Checkbox>
        </div>
      </fieldset>

      <hr class="my-5 border-none" />
      <div class="text-center">
        <button type="submit" class="btn-magic">
          Haz un cuento!
        </button>
      </div>
    </form>
    <section id="response" v-if="text">
      <div class="playwrite whitespace-pre-line leading-6 break-words">{{ text }}</div>
      <div class="text-center mt-12">
        <button @click="text = ''" class="btn-magic">
          &larr; Volver a empezar
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import personajesJSON from '~/assets/personajes.json'; // Importa el JSON directament
import CheckboxPersonaje from '~/components/CheckboxPersonaje.vue';

const text = ref("");
const personajesData = ref(personajesJSON);

const personajes = ref(
  personajesData.value.reduce((acc, curr) => {
    acc[curr.personaje] = false;
    return acc;
  }, {})
);

const moralejas = reactive({
  envidia: false,
  soberbia: false,
  pereza: false,
  avaricia: false,
  lujuria: false
});

const estilos = reactive({
  disney: false,
  larryDavid: false,
  friends: false
});

const isLoading = ref(false);

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
  isLoading.value = true;  // Inicia el loading

  /*
  const selectedPersonajes = personajesData.value.filter(
    personaje => personajes[personaje.personaje]
  );
  */

 var selectedPersonajes = [];
  
  for (const personaje in personajes.value) {
    console.log('personaje', personaje, personajes[personaje]);
    if (personajes.value[personaje]) {
      const index = personajesData.value.findIndex(p => p.personaje === personaje);
      selectedPersonajes.push(personajesData.value[index]);
    }
  } 

  const selectedMoralejas = Object.keys(moralejas).filter(
    key => moralejas[key]
  );

  const selectedEstilos = Object.keys(estilos).filter(
    key => estilos[key]
  );

  try {
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

    /*
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
    */

    text.value = await response.text();
    // var text = '';
    // for await (const textPart of response.text()) {
    //   text += textPart;
    // }
  } catch (error) {
    console.error('Error during fetch:', error);
  } finally {
    isLoading.value = false;  // Acaba el loading
  }
};

const updateName = ( personaje, newName ) => {
  console.log('updateName', personaje, newName);
  const index = personajesData.value.findIndex(p => p.personaje === personaje);
  console.log('index', index);
  if (index !== -1) {
    personajesData.value[index].nombre = newName;
  }
};


const updatePersonaje = ({ oldPersonaje, newPersonaje, newName, newRol }) => {
  console.log('updatePersonaje', oldPersonaje, newPersonaje, newName, newRol);
  const index = personajesData.value.findIndex(p => p.personaje === oldPersonaje);
  console.log('index', index);
  if (index !== -1) {
    personajesData.value[index].personaje = newPersonaje;
    personajesData.value[index].nombre = newName;
    personajesData.value[index].rol = newRol;
    personajes.value[newPersonaje] = personajes.value[oldPersonaje];
    delete personajes.value[oldPersonaje];
  }
};


const generateCharacter = async () => {
  console.log('generateCharacter');

  const response = await fetch('/api/character', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      charactersExcluded: personajesData.value.map(p => p.personaje),
    }),
  });

  if (!response.body) {
    console.error('No response body');
    return;
  }

  const character = await response.json();
  console.log('character', character);

  // push the new character to the list
  personajesData.value.push(character);
};
</script>

<template>
  <div class="max-w-xl mx-auto py-4 px-4">
    <section v-if="!text">
      <h1 class="playwrite pb-6 text-xl font-bold text-white-900 md:text-3xl">
        Buenas noches <em>baby</em>!
      </h1>
      
      <fieldset class="mb-6 pt-3">
        <legend class="text-slate-200 font-semibold">Personajes</legend>
        <div id="chars__list" class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <CheckboxPersonaje v-for="personaje in personajesData" :key="personaje.personaje" v-model="personajes[personaje.personaje]" :id="personaje.personaje" :personaje="personaje" @update:personaje="updatePersonaje" />
            <button @click="generateCharacter" class="flex gap-3 rounded-md transition duration-300 ease-in-out border border-white text-left px-4 py-2 cursor-pointer items-center">
              <IconMagic class="fill-white w-6 h-6" />
              <span>Generar personaje</span>
            </button>
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
          <Checkbox v-model="estilos.verso" id="verso">En Verso</Checkbox>
          <Checkbox v-model="estilos.disney" id="disney">Disney</Checkbox>
          <Checkbox v-model="estilos.larryDavid" id="larryDavid">Larry David</Checkbox>
          <Checkbox v-model="estilos.friends" id="friends">Friends</Checkbox>
        </div>
      </fieldset>

      <hr class="my-5 border-none" />
      
      <button @click="handleSubmit" class="btn-magic flex items-center justify-center mx-auto" :disabled="isLoading">
        <IconMagic class="fill-white w-6 h-6 mr-2" />
        {{ isLoading ? 'Loading...' : $t('Haz un cuento') + '!' }}
      </button>
    
    </section>
    <section id="response" v-if="text">
      <div class="playwrite whitespace-pre-line leading-6 break-words">{{ text }}</div>
      <div class="text-center mt-12">
        <button @click="text = ''" class="btn-magic">
          &larr; {{ $t('Volver a empezar') }}
        </button>
      </div>
    </section>
  </div>
</template>


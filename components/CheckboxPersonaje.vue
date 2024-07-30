<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  id: {
    type: String,
    required: true
  },
  personaje: Object
});

const emits = defineEmits(['update:modelValue', 'update:name']);
const checked = ref(props.modelValue);
const newName = ref(props.personaje.nombre);

watch(() => props.modelValue, (newValue) => {
  checked.value = newValue;
});

const updateValue = () => {
  emits('update:modelValue', checked.value);
};

const openDialog = () => {
  const dialog = document.querySelector("dialog#" + props.id);
  dialog.showModal();
};

const closeDialog = () => {
  const dialog = document.querySelector("dialog#" + props.id);
  dialog.close();
};

const updateName = () => {
  emits('update:name', props.personaje.personaje, newName.value);
  closeDialog();
};
</script>

<template>
  <div 
    class="checkbox relative overflow-hidden rounded-md transition duration-300 ease-in-out border border-white"
    :class="{'bg-white text-slate-800 shadow-md shadow-slate-500': checked, '': !checked}"
  >
    <input 
      type="checkbox" 
      :id="id" 
      v-model="checked" 
      @change="updateValue" 
      class="absolute top-[-100px]" 
    />
    <a @click="openDialog" class="absolute right-3 top-3 cursor-pointer">
      <IconCog class="fill-white w-4 h-4" />
    </a>
    <label 
      :for="id" 
      class="flex flex-col capitalize px-4 py-2 cursor-pointer"
    >
        <slot>
          <span>{{ personaje.personaje }}</span>
          <small class="italic">({{ personaje.nombre }}, {{ personaje.rol }})</small>
        </slot>
    </label>

    <dialog :id="id" class="border border-white bg-slate-900 p-4 text-white">
      <div class="dialog-content">
        <h3 class="capitalize">{{ personaje.personaje }}:</h3>
        <input v-model="newName" type="text" class="text-black block mt-4 p-1" />
        <div class="mt-4">
          <a @click="updateName" class="flex justify-center px-4 py-2 bg-sky-500 text-white rounded w-full text-center">
            <IconSave class="fill-white w-4 h-4" />
          </a>
        </div>
      </div>
    </dialog>

  </div>
</template>

<style scoped>
::backdrop {
  background-color: black;
  opacity: 0.90;
}
</style>

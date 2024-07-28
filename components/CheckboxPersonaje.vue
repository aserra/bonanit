
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

const emits = defineEmits(['update:modelValue']);
const checked = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  checked.value = newValue;
});

const updateValue = () => {
  emits('update:modelValue', checked.value);
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
    <label 
      :for="id" 
      class="flex flex-col capitalize px-4 py-2 cursor-pointer"
    >
        <slot>
          <span>{{ personaje.personaje }}</span>
          <small class="italic">({{ personaje.nombre }}, {{ personaje.rol }})</small>
        </slot>
    </label>
  </div>
</template>

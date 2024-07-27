<template>
  <div class="checkbox">
    <input type="checkbox" :id="id" v-model="checked" @change="updateValue" />
    <label :for="id">
      <span class="checkbox__icon"></span>
      <span class="checkbox__text">
        <slot></slot>
      </span>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  id: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['update:modelValue']);

const checked = ref(props.modelValue);

const updateValue = () => {
  emits('update:modelValue', checked.value);
};
</script>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
}
.checkbox__icon {
  width: 16px;
  height: 16px;
  border: 2px solid #000;
  margin-right: 8px;
  display: inline-block;
  position: relative;
}
.checkbox__icon::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}
input[type='checkbox']:checked + label .checkbox__icon::after {
  opacity: 1;
}
.checkbox__text {
  display: inline-block;
}
</style>

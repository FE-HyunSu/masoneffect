<script setup>
import { ref } from 'vue';
import MasonEffect from 'masoneffect/vue';

const effectRef = ref(null);

const handleMorph = () => {
  effectRef.value?.morph();
};

const handleScatter = () => {
  effectRef.value?.scatter();
};

const handleChangeText = () => {
  const texts = ['Hello', 'World', 'Mason', 'Effect'];
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  effectRef.value?.morph(randomText);
};

const onReady = (instance) => {
  console.log('Ready!', instance);
};
</script>

<template>
  <div style="width: 100%; height: 70vh; background: #000">
    <MasonEffect
      ref="effectRef"
      text="Hello Vue"
      :particle-color="'#00ff88'"
      :max-particles="2000"
      @ready="onReady"
    />
    <div style="padding: 20px; display: flex; gap: 10px">
      <button @click="handleMorph">Morph</button>
      <button @click="handleScatter">Scatter</button>
      <button @click="handleChangeText">Change Text</button>
    </div>
  </div>
</template>

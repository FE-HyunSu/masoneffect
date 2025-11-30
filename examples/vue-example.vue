<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MasonEffect from 'masoneffect/vue';

const effectRef = ref(null);
const isMonitoring = ref(false);
const fps = ref(0);
const frameTime = ref(0);
const getImageDataTime = ref(0);
const memory = ref(0);
const particles = ref(0);
const canvasSize = ref('--');
const fpsHistory = ref([]);
let frameId = null;
let lastTime = performance.now();

const handleMorph = () => {
  effectRef.value?.morph({ text: 'Morphed!' });
};

const handleScatter = () => {
  effectRef.value?.scatter();
};

const handleChangeText = () => {
  const texts = ['Hello', 'World', 'Mason', 'Effect'];
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  effectRef.value?.morph({ text: randomText });
};

const onReady = (instance) => {
  console.log('Ready!', instance);
};

const updateStats = () => {
  const now = performance.now();
  const delta = now - lastTime;
  lastTime = now;

  fps.value = Math.round(1000 / delta);
  frameTime.value = parseFloat(delta.toFixed(2));

  if (fpsHistory.value.length >= 60) {
    fpsHistory.value.shift();
  }
  fpsHistory.value.push(fps.value);

  if (performance.memory) {
    memory.value = parseFloat((performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2));
  }

  if (effectRef.value) {
    const instance = effectRef.value;
    particles.value = instance.particles?.length || 0;
    if (instance.canvas) {
      canvasSize.value = `${instance.canvas.width}×${instance.canvas.height}`;
    }
  }

  if (isMonitoring.value) {
    frameId = requestAnimationFrame(updateStats);
  }
};

const toggleMonitoring = () => {
  isMonitoring.value = !isMonitoring.value;
  if (isMonitoring.value) {
    lastTime = performance.now();
    frameId = requestAnimationFrame(updateStats);
  } else if (frameId) {
    cancelAnimationFrame(frameId);
  }
};

const getStatColor = (value, thresholds) => {
  if (value > thresholds.error) return '#F44336';
  if (value > thresholds.warning) return '#FF9800';
  return '#4CAF50';
};

onBeforeUnmount(() => {
  if (frameId) {
    cancelAnimationFrame(frameId);
  }
});
</script>

<template>
  <div style="width: 100%; height: 70vh; background: #000; position: relative">
    <MasonEffect
      ref="effectRef"
      text="Hello Vue"
      :particle-color="'#00ff88'"
      :max-particles="2000"
      @ready="onReady"
    />
    <div style="
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(26, 26, 26, 0.9);
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #3a3a3a;
      min-width: 280px;
      z-index: 1000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      color: #fff;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
        <h3 style="margin: 0; font-size: 14px">Performance Monitor</h3>
        <button
          @click="toggleMonitoring"
          :style="{
            padding: '4px 12px',
            background: isMonitoring ? '#F44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
          }"
        >
          {{ isMonitoring ? 'Stop' : 'Start' }}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px">
        <div>
          <div style="font-size: 10px; color: #aaa; margin-bottom: 2px">FPS</div>
          <div :style="{
            fontSize: '20px',
            fontWeight: 'bold',
            color: getStatColor(fps, { warning: 50, error: 30 }),
          }">
            {{ fps }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; color: #aaa; margin-bottom: 2px">Frame Time</div>
          <div :style="{
            fontSize: '20px',
            fontWeight: 'bold',
            color: getStatColor(frameTime, { warning: 20, error: 33.33 }),
          }">
            {{ frameTime }}ms
          </div>
        </div>
        <div>
          <div style="font-size: 10px; color: #aaa; margin-bottom: 2px">getImageData</div>
          <div :style="{
            fontSize: '20px',
            fontWeight: 'bold',
            color: getStatColor(getImageDataTime, { warning: 10, error: 16.67 }),
          }">
            {{ getImageDataTime }}ms
          </div>
        </div>
        <div>
          <div style="font-size: 10px; color: #aaa; margin-bottom: 2px">Memory</div>
          <div style="font-size: 20px; font-weight: bold; color: #4CAF50">
            {{ memory > 0 ? `${memory}MB` : 'N/A' }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; color: #aaa; margin-bottom: 2px">Particles</div>
          <div style="font-size: 20px; font-weight: bold; color: #4CAF50">
            {{ particles }}
          </div>
        </div>
        <div>
          <div style="font-size: 10px; color: #aaa; margin-bottom: 2px">Canvas</div>
          <div style="font-size: 20px; font-weight: bold; color: #4CAF50">
            {{ canvasSize }}
          </div>
        </div>
      </div>

      <div v-if="fpsHistory.length > 0" style="margin-top: 10px">
        <div style="font-size: 10px; color: #aaa; margin-bottom: 5px">FPS History</div>
        <div style="display: flex; align-items: flex-end; height: 40px; gap: 2px">
          <div
            v-for="(fpsValue, idx) in fpsHistory"
            :key="idx"
            :style="{
              flex: 1,
              background: fpsValue < 30 ? '#F44336' : fpsValue < 50 ? '#FF9800' : '#4CAF50',
              minHeight: '1px',
              height: `${(fpsValue / 60) * 100}%`,
            }"
          />
        </div>
      </div>
    </div>
    <div style="padding: 20px; display: flex; gap: 10px">
      <button @click="handleMorph">Morph</button>
      <button @click="handleScatter">Scatter</button>
      <button @click="handleChangeText">Change Text</button>
    </div>
  </div>
</template>

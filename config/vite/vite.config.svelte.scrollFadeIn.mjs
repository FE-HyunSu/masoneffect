import { createFrameworkLibConfig } from './library-config.mjs';

export default createFrameworkLibConfig({
  configDir: import.meta.dirname,
  framework: 'svelte',
  effect: 'scrollFadeIn',
});

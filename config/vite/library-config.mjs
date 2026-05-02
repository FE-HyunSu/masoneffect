import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import sveltePreprocess from 'svelte-preprocess';

/** Parent of `config/` (repository root). Pass `import.meta.dirname` from `config/vite/*.mjs`. */
export function getRepoRoot(configViteDir) {
  return resolve(configViteDir, '..', '..');
}

function toPascalFromCamel(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const terserOptions = {
  compress: {
    drop_console: false,
    drop_debugger: true,
  },
};

/**
 * @param {object} opts
 * @param {string} opts.configDir - `import.meta.dirname` of the calling file (always `config/vite`)
 * @param {'vue' | 'svelte'} opts.framework
 * @param {string | null} opts.effect - `null` for main index bundle, else subfolder e.g. `count`, `textToParticle`
 */
export function createFrameworkLibConfig({ configDir, framework, effect }) {
  const root = getRepoRoot(configDir);
  const isMain = effect == null;

  if (framework === 'vue') {
    const include = isMain
      ? ['src/vue/**/*.ts', 'src/vue/**/*.vue']
      : [`src/vue/${effect}/**/*.ts`, `src/vue/${effect}/**/*.vue`];
    const exclude = isMain
      ? ['src/vue/**/*.test.*', 'src/vue/**/*.spec.*']
      : [`src/vue/${effect}/**/*.test.*`, `src/vue/${effect}/**/*.spec.*`];
    const outDir = isMain ? 'dist/vue' : `dist/vue/${effect}`;
    const entryRel = isMain ? 'src/vue/index.ts' : `src/vue/${effect}/index.ts`;
    const libName = isMain ? 'MasonEffectVue' : `MasonEffectVue${toPascalFromCamel(effect)}`;

    return defineConfig({
      root,
      plugins: [
        vue({
          script: {
            defineModel: true,
            propsDestructure: true,
          },
        }),
        dts({
          include,
          exclude,
          outDir,
          rollupTypes: true,
          compilerOptions: {
            declaration: true,
            declarationMap: false,
          },
        }),
      ],
      resolve: {
        alias: {
          '@': resolve(root, 'src'),
        },
      },
      build: {
        lib: {
          entry: resolve(root, entryRel),
          name: libName,
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
        outDir,
        sourcemap: false,
        minify: 'terser',
        terserOptions,
      },
    });
  }

  const include = isMain
    ? ['src/svelte/**/*.ts', 'src/svelte/**/*.svelte']
    : [`src/svelte/${effect}/**/*.ts`, `src/svelte/${effect}/**/*.svelte`];
  const exclude = isMain
    ? ['src/svelte/**/*.test.*', 'src/svelte/**/*.spec.*']
    : [`src/svelte/${effect}/**/*.test.*`, `src/svelte/${effect}/**/*.spec.*`];
  const outDir = isMain ? 'dist/svelte' : `dist/svelte/${effect}`;
  const entryRel = isMain ? 'src/svelte/index.ts' : `src/svelte/${effect}/index.ts`;
  const libName = isMain ? 'MasonEffectSvelte' : `MasonEffectSvelte${toPascalFromCamel(effect)}`;

  const dtsBase = {
    include,
    exclude,
    outDir,
    rollupTypes: true,
    compilerOptions: {
      declaration: true,
      declarationMap: false,
    },
  };
  if (!isMain) {
    dtsBase.skipDiagnostics = true;
  }

  return defineConfig({
    root,
    plugins: [
      svelte({
        compilerOptions: {
          css: 'external',
        },
        preprocess: sveltePreprocess(),
      }),
      dts(dtsBase),
    ],
    resolve: {
      alias: {
        '@': resolve(root, 'src'),
      },
    },
    build: {
      lib: {
        entry: resolve(root, entryRel),
        name: libName,
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: ['svelte'],
        output: {
          globals: {
            svelte: 'Svelte',
          },
        },
      },
      outDir,
      sourcemap: false,
      minify: 'terser',
      terserOptions,
    },
  });
}

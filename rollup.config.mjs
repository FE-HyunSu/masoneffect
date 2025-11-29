import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const basePlugins = [
  resolve({
    browser: true,
  }),
  commonjs(),
];

// Terser options for production builds
const terserOptions = {
  compress: {
    drop_console: false,
    drop_debugger: true,
    pure_funcs: ['console.debug', 'console.trace'],
    passes: 2,
  },
  mangle: {
    toplevel: true,
    properties: {
      regex: /^_/,
    },
  },
  format: {
    comments: false,
  },
  ecma: 2020,
  module: true,
};

// Core library build (ESM + CJS)
const coreBuild = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
    }),
    terser(terserOptions),
  ],
};

// UMD build (for CDN usage)
const umdBuild = {
  input: 'src/index.umd.ts',
  output: [
    {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'MasonEffect',
      exports: 'default',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      sourceMap: false,
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
    }),
    terser(terserOptions),
  ],
};

// React component build (ESM + CJS)
const reactBuild = {
  input: 'src/react/MasonEffect.tsx',
  output: [
    {
      file: 'dist/react/MasonEffect.mjs',
      format: 'es',
    },
    {
      file: 'dist/react/MasonEffect.cjs',
      format: 'cjs',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
    }),
    terser(terserOptions),
  ],
};

// React index build (for type exports)
const reactIndexBuild = {
  input: 'src/react/index.ts',
  output: [
    {
      file: 'dist/react/index.mjs',
      format: 'es',
    },
    {
      file: 'dist/react/index.cjs',
      format: 'cjs',
    },
  ],
  external: (id, importer) => {
    // react, react-dom은 external
    if (id === 'react' || id === 'react-dom') return true;
    // src/react/index.ts에서 ./MasonEffect를 import하는 경우 external로 처리
    if (importer && importer.includes('src/react/index.ts')) {
      if (id === './MasonEffect' || id.startsWith('./MasonEffect')) return true;
    }
    return false;
  },
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react',
      rootDir: 'src',
      declarationMap: false,
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
    }),
    // Resolve MasonEffect import to use .mjs extension for ESM
    {
      name: 'resolve-mason-effect-extension',
      renderChunk(code, chunk, options) {
        // ESM 파일에서 ./MasonEffect 또는 ./MasonEffect.tsx를 ./MasonEffect.mjs로 변경
        if (chunk.fileName === 'index.mjs') {
          code = code.replace(/from ['"]\.\/MasonEffect(\.tsx)?['"]/g, "from './MasonEffect.mjs'");
          return code;
        }
        return null;
      },
    },
  ],
};

// Vue component is built separately using Vite (see vite.config.ts)
// This is because Vue SFC compilation requires @vitejs/plugin-vue

export default [
  coreBuild,
  umdBuild,
  reactBuild,
  reactIndexBuild,
];

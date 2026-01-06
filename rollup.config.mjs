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

// Core library build (ESM + CJS) - 하위 호환성용
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
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// TextToParticle core build (ESM + CJS) - 독립 빌드
const textToParticleCoreBuild = {
  input: 'src/core/textToParticle/index.ts',
  output: [
    {
      file: 'dist/textToParticle/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/textToParticle/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/textToParticle',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// Count core build (ESM + CJS) - 독립 빌드
const countCoreBuild = {
  input: 'src/core/count/index.ts',
  output: [
    {
      file: 'dist/count/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/count/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/count',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// Typing core build (ESM + CJS) - 독립 빌드
const typingCoreBuild = {
  input: 'src/core/typing/index.ts',
  output: [
    {
      file: 'dist/typing/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/typing/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/typing',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// ScrollFadeIn core build (ESM + CJS) - 독립 빌드
const scrollFadeInCoreBuild = {
  input: 'src/core/scrollFadeIn/index.ts',
  output: [
    {
      file: 'dist/scrollFadeIn/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/scrollFadeIn/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/scrollFadeIn',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// TextSpin core build (ESM + CJS) - 독립 빌드
const textSpinCoreBuild = {
  input: 'src/core/textSpin/index.ts',
  output: [
    {
      file: 'dist/textSpin/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/textSpin/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/textSpin',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
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
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// React TextToParticle component build (ESM + CJS) - 독립 빌드
const reactTextToParticleBuild = {
  input: 'src/react/textToParticle/index.ts',
  output: [
    {
      file: 'dist/react/textToParticle/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/react/textToParticle/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react/textToParticle',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// React Count component build (ESM + CJS) - 독립 빌드
const reactCountBuild = {
  input: 'src/react/count/index.ts',
  output: [
    {
      file: 'dist/react/count/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/react/count/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react/count',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// React Typing component build (ESM + CJS) - 독립 빌드
const reactTypingBuild = {
  input: 'src/react/typing/index.ts',
  output: [
    {
      file: 'dist/react/typing/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/react/typing/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react/typing',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// React ScrollFadeIn component build (ESM + CJS) - 독립 빌드
const reactScrollFadeInBuild = {
  input: 'src/react/scrollFadeIn/index.ts',
  output: [
    {
      file: 'dist/react/scrollFadeIn/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/react/scrollFadeIn/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react/scrollFadeIn',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    terser(terserOptions),
  ],
};

// React TextSpin component build (ESM + CJS) - 독립 빌드
const reactTextSpinBuild = {
  input: 'src/react/textSpin/index.ts',
  output: [
    {
      file: 'dist/react/textSpin/index.mjs',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/react/textSpin/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    ...basePlugins,
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/react/textSpin',
      rootDir: 'src',
      exclude: ['src/vue/**/*', 'src/svelte/**/*'],
      compilerOptions: {
        skipLibCheck: true,
      },
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
    // src/react/index.ts에서 ./textToParticle, ./count, ./typing, ./scrollFadeIn, ./textSpin를 import하는 경우 external로 처리
    if (importer && importer.includes('src/react/index.ts')) {
      if (id === './textToParticle' || id.startsWith('./textToParticle')) return true;
      if (id === './count' || id.startsWith('./count')) return true;
      if (id === './typing' || id.startsWith('./typing')) return true;
      if (id === './scrollFadeIn' || id.startsWith('./scrollFadeIn')) return true;
      if (id === './textSpin' || id.startsWith('./textSpin')) return true;
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
      compilerOptions: {
        skipLibCheck: true,
      },
    }),
    // Resolve imports to use .mjs extension for ESM
    {
      name: 'resolve-import-extension',
      renderChunk(code, chunk, options) {
        // ESM 파일에서 ./textToParticle, ./count, ./typing, ./scrollFadeIn, ./textSpin를 .mjs 확장자로 변경
        if (chunk.fileName === 'index.mjs') {
          code = code.replace(/from ['"]\.\/textToParticle(\/index)?['"]/g, "from './textToParticle/index.mjs'");
          code = code.replace(/from ['"]\.\/count(\/index)?['"]/g, "from './count/index.mjs'");
          code = code.replace(/from ['"]\.\/typing(\/index)?['"]/g, "from './typing/index.mjs'");
          code = code.replace(/from ['"]\.\/scrollFadeIn(\/index)?['"]/g, "from './scrollFadeIn/index.mjs'");
          code = code.replace(/from ['"]\.\/textSpin(\/index)?['"]/g, "from './textSpin/index.mjs'");
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
  textToParticleCoreBuild,
  countCoreBuild,
  typingCoreBuild,
  scrollFadeInCoreBuild,
  textSpinCoreBuild,
  umdBuild,
  reactTextToParticleBuild,
  reactCountBuild,
  reactTypingBuild,
  reactScrollFadeInBuild,
  reactTextSpinBuild,
  reactIndexBuild,
];

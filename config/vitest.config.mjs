import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');

export default defineConfig({
  root,
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
});

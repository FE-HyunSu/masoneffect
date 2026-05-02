import { describe, it, expect } from 'vitest';
import { easingFunctions } from './index.js';

describe('Count easingFunctions', () => {
  it('linear maps 0 and 1', () => {
    expect(easingFunctions.linear(0)).toBe(0);
    expect(easingFunctions.linear(1)).toBe(1);
  });

  it('easeOutCubic ends at 1', () => {
    expect(easingFunctions.easeOutCubic(1)).toBe(1);
  });
});

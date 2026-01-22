// src/__tests__/utils.test.ts

import { cn, formatDate, debounce } from '@/lib/utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });
});

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('January 1, 2023');
  });
});

// Add more tests as needed
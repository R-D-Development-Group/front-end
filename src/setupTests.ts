import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
} as unknown as typeof IntersectionObserver;

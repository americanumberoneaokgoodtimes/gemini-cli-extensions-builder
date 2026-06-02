import '@testing-library/react';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Add any global setup or mocks here
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

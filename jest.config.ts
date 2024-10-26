import type { Config } from 'jest';

const commonConfig: Partial<Config> = {
    preset: 'ts-jest',
    testEnvironment: 'browser',
    collectCoverageFrom: [
        'scr/**/*.ts',
        '!src/**/types.ts',
        '!src/index.ts',
    ],
    clearMocks: true,
    restoreMocks: true,
    moduleDirectories: ['node_modules', '<rootDir>'],
    setupFiles: ['<rootDir>/tests/setup-jest.ts']
};

module.exports = commonConfig;
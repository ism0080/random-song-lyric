module.exports = {
  displayName: 'web',
  globals: {
    __DEV__: true
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.{ts,tsx}'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleDirectories: ['<rootDir>/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^.+\\.svg': '<rootDir>/svgTransform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'test-file-stub',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tools/', '.*.interface.ts', '/stories/', '.*.less.d.ts'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 80,
      statements: 80
    }
  },
  setupFiles: ['jest-canvas-mock'],
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['cobertura', 'json', 'lcov', 'text', 'clover']
}

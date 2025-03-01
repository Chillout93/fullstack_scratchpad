module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript files
  testEnvironment: 'node', // Run tests in a Node.js environment
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'], // Match .ts test files
  moduleFileExtensions: ['ts', 'js'], // Recognize both TypeScript and JavaScript files
};
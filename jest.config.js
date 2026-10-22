/**
 * Jest config. The current suite covers the pure (RN-free) logic of the
 * statement-of-facts flow, so it runs in a plain node environment with
 * babel-jest (babel-preset-expo handles the TS/JSX transform). `jest-expo` is
 * installed for future component tests.
 */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/**/*.test.ts"],
};

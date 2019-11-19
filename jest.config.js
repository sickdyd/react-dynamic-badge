module.exports = {
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/test/__mocks__/styleMock.js',
    "setupFiles": [
      "./__mocks__/client.js"
    ],
  }
};
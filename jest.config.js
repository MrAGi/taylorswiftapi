module.exports = {
  setupFiles: ['dotenv/config'],
  preset: 'jest-dynalite',
  testPathIgnorePatterns: ['__helpers__*', 'dist*'],
};

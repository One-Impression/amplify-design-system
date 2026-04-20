import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['../tokens-foundation/tokens/**/*.json', 'tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'amplify-atmosphere',
      buildPath: 'dist/',
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
    scss: {
      transformGroup: 'scss',
      prefix: 'amplify-atmosphere',
      buildPath: 'dist/',
      files: [{ destination: 'variables.scss', format: 'scss/variables' }],
    },
    json: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{ destination: 'tokens.json', format: 'json/flat' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
  },
});

await sd.buildAllPlatforms();
console.log('tokens-atmosphere: build complete');

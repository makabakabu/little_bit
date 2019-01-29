module.exports = function(wallaby) {
  var path = require('path');
  process.env.NODE_ENV = 'test';
  process.env.NODE_PATH +=
    path.delimiter +
    path.join(__dirname, 'node_modules') +
    path.delimiter +
    path.join(__dirname, 'node_modules/react-scripts/node_modules');
  require('module').Module._initPaths();

  return {
    files: [
      { pattern: 'src/setupTests.ts', instrument: false },
      'src/**/*.+(ts|tsx|jsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!src/**/*.test.ts?(x)',
    ],

    tests: ['src/**/*.test.ts?(x)'],

    env: {
      type: 'node',
      runner: 'node',
    },

    preprocessors: {
      '**/*.js?(x)': file =>
        require('@babel/core').transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          presets: ['react-app'],
        }),
    },

    setup: wallaby => {
      const jestConfig = require('/Users/vincent/Dropbox/Job/Ctrip/little_bit/jestConfig.json');
      Object.keys(jestConfig.transform || {}).forEach(
        k => ~k.indexOf('^.+\\.(js|jsx') && void delete jestConfig.transform[k],
      );
      delete jestConfig.testEnvironment;
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest',
  };
};

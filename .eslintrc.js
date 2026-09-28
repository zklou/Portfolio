module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  overrides: [
    {
      files: ['src/story/**/*.tsx'],
      rules: {
        // React's DOM property allowlist does not include React Three Fiber props.
        'react/no-unknown-property': 'off',
      },
    },
  ],
};

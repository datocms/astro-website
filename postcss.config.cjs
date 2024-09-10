module.exports = {
  plugins: {
    'postcss-nested': {},
    rfs: {
      baseValue: '16px',
      unit: 'px',
    },
    'postcss-inline-svg': {
      paths: ['src'],
    },
  },
};

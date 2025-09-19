module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // remove 'expo-router/babel'
      ['module-resolver', {
        alias: { '@': './' },
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json']
      }],
      // Reanimated moved here in RN 0.76 / Expo 54
      'react-native-worklets/plugin' // keep last
    ],
  };
};

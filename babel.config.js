module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Note: react-native-reanimated / react-native-worklets plugin is injected
    // automatically by babel-preset-expo (SDK 54+), so it is not listed here.
  };
};

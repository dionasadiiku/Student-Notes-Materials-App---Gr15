module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native" +
      "|@react-native" +
      "|expo(nent)?" +
      "|@expo(nent)?/.*" +
      "|expo-modules-core" +
      "|react-native-reanimated" +
      ")",
  ],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.js",
  ],
};
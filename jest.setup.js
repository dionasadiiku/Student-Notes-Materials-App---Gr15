// jest.setup.js

// --- Icons ---
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialCommunityIcons: "MaterialCommunityIcons",
}));

// --- expo-image-picker ---
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  requestCameraPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: true,
    assets: [],
  })),
  launchCameraAsync: jest.fn(async () => ({
    canceled: true,
    assets: [],
  })),
  MediaTypeOptions: { Images: "Images", Videos: "Videos", All: "All" },
}));

// --- expo-asset ---
jest.mock("expo-asset", () => ({
  Asset: {
    fromModule: jest.fn(() => ({ localUri: "mock-uri" })),
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

// --- expo-constants ---
jest.mock("expo-constants", () => ({
  Constants: {
    manifest: {},
    platform: {},
  },
}));

// --- expo-router ---
jest.mock("expo-router", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  return {
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    usePathname: () => "/",
    __mockRouter: { mockPush, mockReplace },
  };
});

// --- safe-area ---
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// --- Animated warnings (safe) ---
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  RN.Animated = RN.Animated || {};
  RN.Animated.NativeAnimatedHelper = RN.Animated.NativeAnimatedHelper || {
    API: {},
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };

  return RN;
});
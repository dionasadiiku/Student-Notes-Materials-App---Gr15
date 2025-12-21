import { render } from "@testing-library/react-native";
import MapScreen from "../app/map";

// 🔴 REQUIRED: mock native animated (CRITICAL)
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// 🔴 Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

// 🔴 Mock expo-location
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: "granted",
  }),
  watchPositionAsync: jest.fn().mockResolvedValue({
    remove: jest.fn(),
  }),
  Accuracy: {
    High: 1,
  },
}));

// 🔴 Mock react-native-maps
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockMapView = ({ children, ...props }) => (
    <View {...props}>{children}</View>
  );

  const MockMarker = (props) => <View {...props} />;

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// 🔴 Mock vector icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("MapScreen Snapshot", () => {
  it("renders correctly (loader state)", () => {
    const tree = render(<MapScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

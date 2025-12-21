import { render } from "@testing-library/react-native";
import MapScreen from "../app/MapScreen";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

// Mock expo-location with a synchronous implementation
jest.mock("expo-location", () => {
  let locationCallback = null;
  
  return {
    requestForegroundPermissionsAsync: jest.fn(() => 
      Promise.resolve({ status: "granted" })
    ),
    watchPositionAsync: jest.fn((options, callback) => {
      locationCallback = callback;
      // Don't call callback automatically
      return Promise.resolve({ 
        remove: jest.fn(() => {
          locationCallback = null;
        }) 
      });
    }),
    Accuracy: {
      High: 4,
    },
    // Test helper to manually trigger location
    __testTriggerLocation: (coords) => {
      if (locationCallback) {
        locationCallback({ coords });
      }
    },
  };
});

// Mock react-native-maps
jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  const MockMapView = (props) => <View {...props} />;
  const MockMarker = (props) => <View {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// Mock Ionicons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

describe("MapScreen Snapshot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    const { toJSON } = render(<MapScreen />);
    const tree = toJSON();
    expect(tree).toMatchSnapshot();
  });
});
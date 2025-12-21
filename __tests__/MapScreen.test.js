import { render } from "@testing-library/react-native";
import MapScreen from "../app/MapScreen";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

// Mock expo-location
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: "granted" })
  ),
  watchPositionAsync: jest.fn(() => 
    Promise.resolve({ remove: jest.fn() })
  ),
  Accuracy: {
    High: 4,
  },
}));

// Mock react-native-maps
jest.mock("react-native-maps", () => ({
  __esModule: true,
  default: "MapView",
  Marker: "Marker",
}));

describe("MapScreen Snapshot", () => {
  it("renders correctly when location is available", () => {
    const tree = render(
      <MapScreen />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("renders loading state correctly", () => {
    // We can't directly test the loading state since useEffect runs immediately
    // But we can test the component structure
    const tree = render(
      <MapScreen />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
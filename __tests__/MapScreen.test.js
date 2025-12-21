import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import MapScreen from "../app/MapScreen";


// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

// Mock Ionicons (shpesh shkakton probleme në Jest)
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock react-native-maps si komponentë reale (më stabile se stringa)
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockMapView = (props) => <View {...props}>{props.children}</View>;
  const MockMarker = (props) => <View {...props} />;

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// Mock expo-location
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({
    status: "granted",
  }),
  watchPositionAsync: jest.fn(),
  Accuracy: { High: 4 },
}));

import * as Location from "expo-location";

describe("MapScreen Snapshot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    // mos e thirr callback-un -> location mbetet null -> loader
    Location.watchPositionAsync.mockResolvedValueOnce({ remove: jest.fn() });

    const tree = render(<MapScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly when location is available", async () => {
    // thirre callback-un menjeher me coords fake
    Location.watchPositionAsync.mockImplementationOnce(async (opts, cb) => {
      cb({
        coords: { latitude: 42.6629, longitude: 21.1655 },
      });
      return { remove: jest.fn() };
    });

    const { toJSON, getByTestId } = render(<MapScreen />);

    // prit derisa të shfaqet MapView (pra location u set)
    await waitFor(() => {
      expect(getByTestId("map")).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });
});

import { render } from "@testing-library/react-native";
import FavoriteModal from "../components/FavoriteModal";

jest.mock("expo-asset", () => ({
  Asset: { loadAsync: jest.fn() },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

// 🔴 MOCK FIRESTORE (KY ËSHTË ÇELËSI)
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

// 🔴 MOCK firebase config
jest.mock("../firebase", () => ({
  auth: {},
  db: {},
}));

describe("FavoriteModal Snapshot", () => {
  it("renders correctly when visible", () => {
    const tree = render(
      <FavoriteModal
        visible={true}
        book={{
          title: "Test Book",
          author: "Test Author",
          cover: "https://example.com/test.jpg",
        }}
        onClose={jest.fn()}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
import { render } from "@testing-library/react-native";
import FavoriteModal from "../app/components/FavoriteModal";

// 🔴 MOCK Modal (CRITICAL)
jest.mock("react-native/Libraries/Modal/Modal", () => {
  return ({ children }) => children;
});

// 🔴 MOCK FIRESTORE (FULL)
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
}));

// 🔴 MOCK firebase config (auth MUST have currentUser)
jest.mock("../firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-user-id",
    },
  },
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

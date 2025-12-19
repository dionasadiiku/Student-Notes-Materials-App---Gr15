import React from "react";
import { render } from "@testing-library/react-native";
import FavoriteModal from "../app/components/FavoriteModal";

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

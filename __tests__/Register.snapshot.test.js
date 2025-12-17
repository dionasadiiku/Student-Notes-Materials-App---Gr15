import React from "react";
import renderer from "react-test-renderer";
import Register from "../app/register";

// MOCK expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

// ✅ MOCK firebase/auth (KY E ZGJIDH ERRORIN)
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

// MOCK firebase config
jest.mock("../firebase", () => ({
  auth: {},
}));

describe("Register Snapshot Test", () => {
  it("matches the snapshot", () => {
    const tree = renderer.create(<Register />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

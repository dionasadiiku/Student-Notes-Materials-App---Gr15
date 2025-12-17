import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Register from "../app/register";

// ================= MOCKS =================

// MOCK expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

// MOCK firebase/auth
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

// MOCK firebase config
jest.mock("../firebase", () => ({
  auth: {},
}));

// ================= TESTS =================

describe("Register Screen", () => {

  test("renders all form elements correctly", () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm Password")).toBeTruthy();

    expect(getByText("Sign Up")).toBeTruthy();
    expect(getByText(/Already have an account/i)).toBeTruthy();
  });

  test("updates email input when user types", () => {
    const { getByPlaceholderText } = render(<Register />);

    const emailInput = getByPlaceholderText("Email");

    fireEvent.changeText(emailInput, "test@example.com");

    expect(emailInput.props.value).toBe("test@example.com");
  });

  test("shows error when all fields are empty", () => {
    const { getByText } = render(<Register />);

    const signUpButton = getByText("Sign Up");

    fireEvent.press(signUpButton);

    expect(getByText("All fields are required")).toBeTruthy();
  });
  test("shows error when email is invalid", () => {
  const { getByPlaceholderText, getByText } = render(<Register />);

  fireEvent.changeText(getByPlaceholderText("Email"), "invalidemail");
  fireEvent.changeText(getByPlaceholderText("Password"), "password123");
  fireEvent.changeText(getByPlaceholderText("Confirm Password"), "password123");

  fireEvent.press(getByText("Sign Up"));

  expect(getByText("Email is not valid")).toBeTruthy();
});


});

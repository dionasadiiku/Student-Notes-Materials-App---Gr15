import { fireEvent, render } from "@testing-library/react-native";
import Register from "../app/register";

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

// Mock firebase/auth
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

// Mock firebase config
jest.mock("../firebase", () => ({
  auth: {},
}));

describe("Register Screen", () => {

  it("renders all form elements correctly", () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm Password")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("updates email input when user types", () => {
    const { getByPlaceholderText } = render(<Register />);
    fireEvent.changeText(
      getByPlaceholderText("Email"),
      "test@example.com"
    );
    expect(getByPlaceholderText("Email").props.value)
      .toBe("test@example.com");
  });

  it("shows error when all fields are empty", () => {
    const { getByText } = render(<Register />);
    fireEvent.press(getByText("Sign Up"));
    expect(getByText("All fields are required")).toBeTruthy();
  });

  it("shows error when email is invalid", () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    fireEvent.changeText(getByPlaceholderText("Email"), "invalidemail");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "password123");
    fireEvent.press(getByText("Sign Up"));
    expect(getByText("Email is not valid")).toBeTruthy();
  });

});

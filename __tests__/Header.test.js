import { act, fireEvent, render } from "@testing-library/react-native";
import { __mockRouter } from "expo-router";
import Header from "../components/header";

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock("../firebase", () => ({
  auth: {},
}));

describe("Header component", () => {
  beforeEach(() => {
    __mockRouter.mockPush.mockClear();
    __mockRouter.mockReplace.mockClear();
  });

  it("opens settings on press", async () => {
    const { getByTestId } = render(<Header />);

    await act(async () => {
      fireEvent.press(getByTestId("settings-btn"));
    });

    expect(__mockRouter.mockPush).toHaveBeenCalledWith("/settings");
  });

  it("logs out and redirects to /login", async () => {
    const { getByTestId } = render(<Header />);

    await act(async () => {
      fireEvent.press(getByTestId("logout-btn"));
    });

    expect(__mockRouter.mockReplace).toHaveBeenCalledWith("/login");
  });
});
import { fireEvent, render } from "@testing-library/react-native";
import { __mockRouter } from "expo-router";
import Footer from "../components/footer";

describe("Footer component", () => {
  beforeEach(() => {
    __mockRouter.mockPush.mockClear();
    __mockRouter.mockReplace.mockClear();
  });

  it("navigates to / when home icon pressed", () => {
    const { getByTestId } = render(<Footer />);

    fireEvent.press(getByTestId("home-icon"));

    // ✅ sepse pathname mock është "/", përdoret replace
    expect(__mockRouter.mockReplace).toHaveBeenCalledWith("/");
  });

  it("navigates to /library when library icon pressed", () => {
    const { getByTestId } = render(<Footer />);
    fireEvent.press(getByTestId("library-icon"));
    expect(__mockRouter.mockPush).toHaveBeenCalledWith("/library");
  });

  it("navigates to /reminder when reminder icon pressed", () => {
    const { getByTestId } = render(<Footer />);
    fireEvent.press(getByTestId("reminder-icon"));
    expect(__mockRouter.mockPush).toHaveBeenCalledWith("/reminder");
  });

  it("navigates to /search when search icon pressed", () => {
    const { getByTestId } = render(<Footer />);
    fireEvent.press(getByTestId("search-icon"));
    expect(__mockRouter.mockPush).toHaveBeenCalledWith("/search");
  });
});
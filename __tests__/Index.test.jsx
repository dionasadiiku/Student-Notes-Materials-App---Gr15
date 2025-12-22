import { render } from "@testing-library/react-native";
import Index from "../app/index";

jest.mock("../firebase", () => ({ auth: { currentUser: null }, db: {} }));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({ docs: [] });
    return jest.fn();
  }),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("../components/header", () => "Header");
jest.mock("../components/footer", () => "Footer");

describe("Index Component", () => {
  it("renders without crashing", () => {
    const tree = render(<Index />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows main navigation cards", () => {
    const { getByText } = render(<Index />);
    expect(getByText("Class recording")).toBeTruthy();
    expect(getByText("Scan Text")).toBeTruthy();
    expect(getByText("My Location")).toBeTruthy();
  });

  it("displays studylist section", () => {
    const { getByText } = render(<Index />);
    expect(getByText("My Studylists")).toBeTruthy();
    expect(getByText("My favorites")).toBeTruthy();
  });
});
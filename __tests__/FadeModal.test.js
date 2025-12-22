import { render } from "@testing-library/react-native";
import { Text, View } from "react-native";
import FadeModal from "../components/FadeModal";

test("FadeModal renders children when visible", () => {
  const { getByText } = render(
    <FadeModal visible={true}>
      <View>
        <Text>Modal content</Text>
      </View>
    </FadeModal>
  );

  expect(getByText("Modal content")).toBeTruthy();
});

import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import AnimatedButton from "../components/AnimatedButton";
// ose ../components/AnimatedButton (varësisht ku e ke)

test("AnimatedButton calls onPress", () => {
  const onPress = jest.fn();

  const { getByText } = render(
    <AnimatedButton onPress={onPress} style={{ padding: 10 }}>
      <Text>Click</Text>
    </AnimatedButton>
  );

  fireEvent.press(getByText("Click"));
  expect(onPress).toHaveBeenCalledTimes(1);
});
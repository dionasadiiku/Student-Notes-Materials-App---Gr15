import { useRef } from "react";
import { Animated, Pressable, Text } from "react-native";

export default function AnimatedButton({
  onPress,
  children,
  style,
  disabled = false,
  textStyle,

  // ✅ SHTO KETO:
  testID,
  accessibilityLabel,
  ...rest
}) {
  const opacity = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    if (disabled) return;
    Animated.timing(opacity, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    if (disabled) return;
    Animated.timing(opacity, {
      toValue: 0.6,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const renderChildren = () => {
    if (typeof children === "string" || typeof children === "number") {
      return <Text style={textStyle}>{children}</Text>;
    }
    return children;
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={fadeOut}
      onPressOut={fadeIn}
      disabled={disabled}
      {...rest}
    >
      <Animated.View style={[style, { opacity: disabled ? 0.5 : opacity }]}>
        {renderChildren()}
      </Animated.View>
    </Pressable>
  );
}

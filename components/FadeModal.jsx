import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, View } from "react-native";

export default function FadeModal({
  visible,
  children,
  onRequestClose,
  closeOnBackdrop = false,
}) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
    >
      <Animated.View style={{ flex: 1, opacity }}>
        {closeOnBackdrop ? (
          <Pressable style={{ flex: 1 }} onPress={onRequestClose}>
            <View style={{ flex: 1 }}>{children}</View>
          </Pressable>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
      </Animated.View>
    </Modal>
  );
}
import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import { colors } from "@/constants/colors";

interface BoopButtonProps {
  onPress: () => void;
  size?: number;
}

export const BoopButton = ({ onPress, size = 77 }: BoopButtonProps) => { // Increased size by 10%
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulse.start();
    rotate.start();

    return () => {
      pulse.stop();
      rotate.stop();
    };
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 1.5 / 2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.rotatingCircle,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: size * 1.3 / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <View style={styles.rotatingDot} />
      </Animated.View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Boop</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    backgroundColor: colors.primary + "20", // 20% opacity
  },
  rotatingCircle: {
    position: "absolute",
    borderWidth: 1,
    borderColor: colors.primary + "40", // 40% opacity
    borderStyle: "dashed",
  },
  rotatingDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    top: 0,
    left: "50%",
    marginLeft: -5,
  },
  button: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 22, // Decreased by 10% from 24
    fontWeight: "bold",
    textAlign: "center",
  },
});
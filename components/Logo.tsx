import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "@/constants/colors";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export const Logo = ({ size = "medium" }: LogoProps) => {
  const getFontSize = () => {
    switch (size) {
      case "small":
        return 24;
      case "medium":
        return 36;
      case "large":
        return 48;
      default:
        return 36;
    }
  };

  const getDotSize = () => {
    switch (size) {
      case "small":
        return 8;
      case "medium":
        return 12;
      case "large":
        return 16;
      default:
        return 12;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: getFontSize() }]}>
        Boop
        <View
          style={[
            styles.dot,
            {
              width: getDotSize(),
              height: getDotSize(),
              borderRadius: getDotSize() / 2,
            },
          ]}
        />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    color: colors.text,
    position: "relative",
  },
  dot: {
    backgroundColor: colors.primary,
    position: "absolute",
    top: 0,
    right: -4,
  },
});
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "@/constants/colors";

interface SocialButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  connected?: boolean;
  style?: ViewStyle;
}

export const SocialButton = ({
  title,
  icon,
  onPress,
  connected = false,
  style,
}: SocialButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        connected ? styles.containerConnected : null,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View
        style={[
          styles.statusIndicator,
          connected ? styles.statusConnected : styles.statusDisconnected,
        ]}
      >
        <Text style={[
          styles.statusText,
          connected ? styles.statusTextConnected : styles.statusTextDisconnected
        ]}>
          {connected ? "Connected" : "Connect"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerConnected: {
    borderColor: colors.success,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusConnected: {
    backgroundColor: colors.success + "20", // 20% opacity
  },
  statusDisconnected: {
    backgroundColor: colors.secondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTextConnected: {
    color: colors.success,
  },
  statusTextDisconnected: {
    color: "#121212", // Dark text for better readability
  },
});
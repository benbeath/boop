import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { colors } from "@/constants/colors";
import { Home, User } from "lucide-react-native";
import { BoopButton } from "./BoopButton";
import { useRouter, usePathname } from "expo-router";

export const TabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/(tabs)" && (pathname === "/(tabs)" || pathname === "/(tabs)/index")) {
      return true;
    }
    if (path === "/profile" && pathname.startsWith("/profile")) {
      return true;
    }
    return false;
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleBoopPress = () => {
    router.push("/boop");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigateTo("/(tabs)")}
        >
          <Home
            size={24}
            color={isActive("/(tabs)") ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color: isActive("/(tabs)") ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <View style={styles.boopButtonContainer}>
          <BoopButton onPress={handleBoopPress} size={77} />
        </View>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigateTo("/profile")}
        >
          <User
            size={24}
            color={isActive("/profile") ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color: isActive("/profile") ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tabBar: {
    flexDirection: "row",
    height: 80,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  boopButtonContainer: {
    position: "absolute",
    top: -35,
    left: "50%",
    marginLeft: -38.5, // Half of the button size (77/2)
    zIndex: 1,
  },
});
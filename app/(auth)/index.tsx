import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { useAuthStore } from "@/store/auth-store";

export default function WelcomeScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);

  const handleSignIn = () => {
    router.push("/(auth)/sign-in");
  };

  const handleSignUp = () => {
    router.push("/(auth)/sign-up");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size="large" />
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
            }}
            style={styles.illustration}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Share & Save</Text>
          <Text style={styles.subtitle}>
            Scan QR codes during checkout, share to your socials, and get instant discounts!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={handleSignIn}
            variant="primary"
            size="large"
            style={styles.button}
          />
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            variant="outline"
            size="large"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  version: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 300,
  },
  circle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#FFC8A2", // Vibrant peach from the reference image
    top: 20,
    left: 20,
    opacity: 1, // Full opacity for vibrant colors
  },
  circle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#A2D8FF", // Vibrant light blue from the reference image
    bottom: 40,
    right: 40,
    opacity: 1, // Full opacity for vibrant colors
  },
  circle3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C9A2FF", // Vibrant light purple from the reference image
    top: 100,
    right: 20,
    opacity: 1, // Full opacity for vibrant colors
  },
  illustration: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  textContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 16,
  },
});
import React, { useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { ConfettiOverlay } from "@/components/ConfettiOverlay";
import { useBoopStore } from "@/store/boop-store";
import { CheckCircle } from "lucide-react-native";

export default function SuccessScreen() {
  const router = useRouter();
  const { currentBoop, clearCurrentBoop } = useBoopStore();
  
  useEffect(() => {
    if (!currentBoop) {
      router.replace("/(tabs)");
    }
  }, [currentBoop, router]);

  const handleDone = () => {
    clearCurrentBoop();
    router.replace("/(tabs)");
  };

  if (!currentBoop) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ConfettiOverlay visible={true} />
      
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <CheckCircle size={60} color={colors.success} />
          </View>
          
          <Text style={styles.title}>Shared Successfully!</Text>
          <Text style={styles.subtitle}>
            Your discount for {currentBoop.retailer} has been applied.
          </Text>
          
          <View style={styles.imageContainer}>
            {currentBoop.selectedImage && (
              <Image
                source={{ uri: currentBoop.selectedImage }}
                style={styles.image}
              />
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Shared to:</Text>
            <View style={styles.socialInfo}>
              <View style={styles.socialBadge}>
                <Text style={styles.socialText}>Instagram</Text>
              </View>
            </View>
            
            <Text style={styles.infoTitle}>Points earned:</Text>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>+50 points</Text>
            </View>
          </View>
        </View>
        
        <Button
          title="Done"
          onPress={handleDone}
          style={styles.doneButton}
        />
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
  successContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success + "20", // 20% opacity
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
    marginBottom: 24,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  socialInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  socialBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#121212", // Dark text for better readability
  },
  pointsContainer: {
    backgroundColor: colors.primary + "20", // 20% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  doneButton: {
    marginBottom: 20,
  },
});
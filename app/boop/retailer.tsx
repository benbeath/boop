import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { ImageGallery } from "@/components/ImageGallery";
import { useBoopStore } from "@/store/boop-store";
import { Tag, Share2 } from "lucide-react-native";

export default function RetailerScreen() {
  const router = useRouter();
  const {
    currentBoop,
    selectImage,
    shareBoop,
    isLoading,
    error,
    clearError,
  } = useBoopStore();

  useEffect(() => {
    if (!currentBoop) {
      router.replace("/boop");
    }
  }, [currentBoop, router]);

  // If no current boop, show loading state
  if (!currentBoop) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Loading..." showBackButton />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading retailer information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSelectImage = (image: string) => {
    selectImage(image);
  };

  const handleShare = async () => {
    if (!currentBoop || !currentBoop.selectedImage) {
      Alert.alert("Error", "Please select an image to share");
      return;
    }

    try {
      if (Platform.OS === "web") {
        // Web doesn't support native sharing, so we'll simulate it
        Alert.alert(
          "Share",
          "On a real device, this would open the native share dialog. For this demo, we'll simulate a successful share.",
          [
            {
              text: "OK",
              onPress: async () => {
                await shareBoop();
                router.push("/boop/success");
              },
            },
          ]
        );
      } else {
        // On native platforms, use the Share API
        // Note: In a production app, we would ideally have Instagram, TikTok, and Snapchat
        // appear first in the share sheet, but this is controlled by the OS based on user preferences
        const result = await Share.share({
          message: `Check out this amazing deal from ${currentBoop.retailer}: ${currentBoop.discount}`,
          url: currentBoop.selectedImage,
          // The title is used on Android
          title: `${currentBoop.retailer} Deal`,
        });

        if (result.action === Share.sharedAction) {
          await shareBoop();
          router.push("/boop/success");
        }
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Share & Save" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.retailerContainer}>
          <View style={styles.retailerInfo}>
            <Text style={styles.retailerName}>{currentBoop.retailer}</Text>
            <View style={styles.discountContainer}>
              <Tag size={16} color={colors.primary} />
              <Text style={styles.discountText}>{currentBoop.discount}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.galleryContainer}>
          <ImageGallery
            images={currentBoop.images}
            onSelectImage={handleSelectImage}
          />
        </View>
        
        <View style={styles.shareContainer}>
          <Text style={styles.shareText}>
            Share this image to your social media to receive your discount!
          </Text>
          <Button
            title="Share Now"
            onPress={handleShare}
            loading={isLoading}
            icon={<Share2 size={20} color="#FFFFFF" />}
            style={styles.shareButton}
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
  },
  retailerContainer: {
    marginBottom: 24,
  },
  retailerInfo: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retailerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "20", // 20% opacity
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  discountText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 8,
  },
  galleryContainer: {
    flex: 1,
  },
  shareContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  shareText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  shareButton: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
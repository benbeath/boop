import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { SocialButton } from "@/components/SocialButton";
import { useAuthStore } from "@/store/auth-store";
import { Instagram, Camera, Ghost } from "lucide-react-native";

export default function ConnectSocialsScreen() {
  const router = useRouter();
  const { user, connectSocial, isLoading } = useAuthStore();
  
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [snapchatConnected, setSnapchatConnected] = useState(false);

  const handleConnectInstagram = async () => {
    // In a real app, this would open OAuth flow
    Alert.alert(
      "Connect Instagram",
      "This would open Instagram's authentication flow.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Connect",
          onPress: async () => {
            await connectSocial("instagram");
            setInstagramConnected(true);
          },
        },
      ]
    );
  };

  const handleConnectTikTok = async () => {
    // In a real app, this would open OAuth flow
    Alert.alert(
      "Connect TikTok",
      "This would open TikTok's authentication flow.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Connect",
          onPress: async () => {
            await connectSocial("tiktok");
            setTiktokConnected(true);
          },
        },
      ]
    );
  };

  const handleConnectSnapchat = async () => {
    // In a real app, this would open OAuth flow
    Alert.alert(
      "Connect Snapchat",
      "This would open Snapchat's authentication flow.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Connect",
          onPress: async () => {
            await connectSocial("snapchat");
            setSnapchatConnected(true);
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Connect Socials" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Connect Your Socials</Text>
          <Text style={styles.subtitle}>
            Connect your social media accounts to share and earn discounts.
          </Text>
        </View>
        
        <View style={styles.socialsContainer}>
          <SocialButton
            title="Instagram"
            icon={<Instagram size={24} color={colors.text} />}
            onPress={handleConnectInstagram}
            connected={instagramConnected}
          />
          
          <SocialButton
            title="TikTok"
            icon={<Camera size={24} color={colors.text} />}
            onPress={handleConnectTikTok}
            connected={tiktokConnected}
          />
          
          <SocialButton
            title="Snapchat"
            icon={<Ghost size={24} color={colors.text} />}
            onPress={handleConnectSnapchat}
            connected={snapchatConnected}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            style={styles.button}
          />
          
          <Button
            title="Skip for now"
            onPress={handleSkip}
            variant="outline"
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
  textContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  socialsContainer: {
    marginVertical: 24,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
  },
});
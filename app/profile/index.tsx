import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Header } from "@/components/Header";
import { SocialButton } from "@/components/SocialButton";
import { Button } from "@/components/Button";
import { TabBar } from "@/components/TabBar";
import { useAuthStore } from "@/store/auth-store";
import * as ImagePicker from "expo-image-picker";
import {
  User,
  Instagram,
  Camera,
  Ghost,
  LogOut,
  Edit,
  Key,
  Upload,
} from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    signOut,
    connectSocial,
    disconnectSocial,
    updateProfilePhoto,
    isLoading,
  } = useAuthStore();
  
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);

  const handleEditUsername = () => {
    router.push("/profile/edit-username");
  };

  const handleChangePassword = () => {
    router.push("/profile/change-password");
  };

  const handleToggleSocial = async (
    platform: "instagram" | "tiktok" | "snapchat"
  ) => {
    if (!user) return;

    const isConnected = user.connectedSocials[platform];

    if (isConnected) {
      // Confirm disconnect
      Alert.alert(
        "Disconnect Account",
        `Are you sure you want to disconnect your ${platform} account?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => disconnectSocial(platform),
          },
        ]
      );
    } else {
      // Connect flow
      Alert.alert(
        `Connect ${platform}`,
        `This would open ${platform}'s authentication flow.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Connect",
            onPress: () => connectSocial(platform),
          },
        ]
      );
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: signOut,
        },
      ]
    );
  };

  const handleChangePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access your photos");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoUri = result.assets[0].uri;
      setProfilePhoto(photoUri);
      
      // In a real app, you would upload the photo to a server
      // For this demo, we'll just update the local state
      if (updateProfilePhoto) {
        updateProfilePhoto(photoUri);
      }
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Profile" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userContainer}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleChangePhoto}
            activeOpacity={0.8}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <>
                <Text style={styles.avatarText}>
                  {user.username.charAt(0).toUpperCase()}
                </Text>
                <View style={styles.editOverlay}>
                  <Upload size={16} color="#FFFFFF" />
                </View>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
          
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsValue}>{user.points}</Text>
            <Text style={styles.pointsLabel}>Total Points</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleEditUsername}
          >
            <View style={styles.settingIconContainer}>
              <Edit size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Edit Username</Text>
              <Text style={styles.settingValue}>{user.username}</Text>
            </View>
            <View style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingIconContainer}>
              <Key size={20} color={colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingValue}>••••••••</Text>
            </View>
            <View style={styles.settingArrow} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          
          <SocialButton
            title="Instagram"
            icon={<Instagram size={24} color={colors.text} />}
            onPress={() => handleToggleSocial("instagram")}
            connected={user.connectedSocials.instagram}
          />
          
          <SocialButton
            title="TikTok"
            icon={<Camera size={24} color={colors.text} />}
            onPress={() => handleToggleSocial("tiktok")}
            connected={user.connectedSocials.tiktok}
          />
          
          <SocialButton
            title="Snapchat"
            icon={<Ghost size={24} color={colors.text} />}
            onPress={() => handleToggleSocial("snapchat")}
            connected={user.connectedSocials.snapchat}
          />
        </View>
        
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
          icon={<LogOut size={20} color={colors.primary} />}
        />
      </ScrollView>
      
      <TabBar />
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
  userContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  pointsContainer: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#121212", // Dark color for better readability
  },
  pointsLabel: {
    fontSize: 14,
    color: "#121212", // Dark color for better readability
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.textSecondary,
    transform: [{ rotate: "45deg" }],
  },
  signOutButton: {
    marginBottom: 100, // Add padding for the tab bar
  },
});
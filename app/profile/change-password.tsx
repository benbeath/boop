import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Header } from "@/components/Header";
import { useAuthStore } from "@/store/auth-store";
import { Lock } from "lucide-react-native";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { updatePassword, isLoading, error, clearError } = useAuthStore();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      isValid = false;
    } else {
      setCurrentPasswordError("");
    }
    
    if (!newPassword) {
      setNewPasswordError("New password is required");
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError("New password must be at least 6 characters");
      isValid = false;
    } else {
      setNewPasswordError("");
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your new password");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      clearError();
      try {
        await updatePassword(currentPassword, newPassword);
        if (!error) {
          Alert.alert("Success", "Password updated successfully", [
            { text: "OK", onPress: () => router.back() },
          ]);
        }
      } catch (error) {
        console.error("Error updating password:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Change Password" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Input
            label="Current Password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            error={currentPasswordError}
            icon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            error={newPasswordError}
            icon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
            icon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
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
  },
  formContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 24,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
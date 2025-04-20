import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Header } from "@/components/Header";
import { useAuthStore } from "@/store/auth-store";
import { User } from "lucide-react-native";

export default function EditUsernameScreen() {
  const router = useRouter();
  const { user, updateUsername, isLoading, error, clearError } = useAuthStore();
  
  const [username, setUsername] = useState(user?.username || "");
  const [usernameError, setUsernameError] = useState("");

  const validateForm = () => {
    if (!username) {
      setUsernameError("Username is required");
      return false;
    }
    
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    
    setUsernameError("");
    return true;
  };

  const handleSave = async () => {
    if (validateForm()) {
      clearError();
      try {
        await updateUsername(username);
        Alert.alert("Success", "Username updated successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Username" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            error={usernameError || (error || "")}
            icon={<User size={20} color={colors.textSecondary} />}
          />
          
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
});
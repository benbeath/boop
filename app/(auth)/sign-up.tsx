import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Header } from "@/components/Header";
import { CountryPicker } from "@/components/CountryPicker";
import { useAuthStore } from "@/store/auth-store";
import { Phone, User, Lock } from "lucide-react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [phoneError, setPhoneError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [selectedCountry, setSelectedCountry] = useState({
    code: "US",
    name: "United States",
    dialCode: "+1",
  });

  const validateForm = () => {
    let isValid = true;
    
    if (!phoneNumber) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (phoneNumber.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
      isValid = false;
    } else {
      setPhoneError("");
    }
    
    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }
    
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    
    return isValid;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      clearError();
      // Format phone number with country code
      const formattedPhoneNumber = `${selectedCountry.dialCode}${phoneNumber}`;
      await signUp(formattedPhoneNumber, username, password);
      router.push("/(auth)/verification");
    }
  };

  const handleSignIn = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sign Up" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <CountryPicker
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />
            <View style={styles.phoneInputWrapper}>
              <Input
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                error={phoneError}
                icon={<Phone size={20} color={colors.textSecondary} />}
                style={styles.phoneInput}
              />
            </View>
          </View>
          
          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            error={usernameError}
            icon={<User size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
            icon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
            icon={<Lock size={20} color={colors.textSecondary} />}
          />
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            loading={isLoading}
            style={styles.button}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
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
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: colors.text,
  },
  phoneInputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  phoneInput: {
    marginBottom: 0,
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signInText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
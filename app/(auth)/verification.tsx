import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { VerificationInput } from "@/components/VerificationInput";
import { useAuthStore } from "@/store/auth-store";

export default function VerificationScreen() {
  const router = useRouter();
  const { verifyCode, isLoading, error, clearError } = useAuthStore();
  
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length === 6) {
      clearError();
      setVerificationError("");
      await verifyCode(code);
      
      // For demo purposes, we'll just navigate to the next screen
      // In a real app, you would check for errors after verification
      router.push("/(auth)/connect-socials");
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      // In a real app, you would call an API to resend the code
      // For demo, we'll just show a success message
      alert("Verification code resent!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Verification" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to your phone number.
          </Text>
          
          <VerificationInput
            length={6}
            value={code}
            onChange={setCode}
          />
          
          {verificationError ? <Text style={styles.errorText}>{verificationError}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Button
            title="Verify"
            onPress={handleVerify}
            loading={isLoading}
            disabled={code.length !== 6}
            style={styles.button}
          />
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={!canResend}
            >
              <Text
                style={[
                  styles.resendButton,
                  !canResend && styles.resendButtonDisabled,
                ]}
              >
                {canResend
                  ? "Resend Code"
                  : `Resend in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
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
  button: {
    marginTop: 24,
    width: "100%",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  resendButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  resendButtonDisabled: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
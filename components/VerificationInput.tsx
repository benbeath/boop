import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import { colors } from "@/constants/colors";

interface VerificationInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
}

export const VerificationInput = ({
  length,
  value,
  onChange,
}: VerificationInputProps) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    // Initialize the array with the correct length
    inputRefs.current = inputRefs.current.slice(0, length);
    
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [length]);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return;

    const newValue = value.split("");
    newValue[index] = text.slice(-1);
    
    const updatedValue = newValue.join("");
    onChange(updatedValue);

    // Move to next input if a digit was entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
      
      // Update the value by removing the previous digit
      const newValue = value.split("");
      newValue[index - 1] = "";
      onChange(newValue.join(""));
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            value[index] ? styles.inputFilled : null,
          ]}
          value={value[index] || ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => handleFocus(index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          selectionColor={colors.primary}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputFilled: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    color: "#121212", // Dark text for better readability
  },
});
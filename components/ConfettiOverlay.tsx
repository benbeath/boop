import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Easing, Dimensions } from "react-native";
import { colors } from "@/constants/colors";

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
  color: string;
  shape: "circle" | "square" | "triangle";
  size: number;
}

interface ConfettiOverlayProps {
  visible: boolean;
  duration?: number;
  count?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const confettiColors = [
  colors.primary,
  colors.secondary,
  colors.accent,
  "#FFD700", // Gold
  "#9C27B0", // Purple
];

export const ConfettiOverlay = ({
  visible,
  duration = 3000,
  count = 50,
}: ConfettiOverlayProps) => {
  const confettiPieces = useRef<ConfettiPiece[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Generate confetti pieces
      confettiPieces.current = Array.from({ length: count }).map((_, i) => {
        const randomSize = Math.random() * 10 + 5;
        const shapes = ["circle", "square", "triangle"] as const;
        
        return {
          id: i,
          x: new Animated.Value(Math.random() * SCREEN_WIDTH),
          y: new Animated.Value(-20),
          rotate: new Animated.Value(0),
          scale: new Animated.Value(Math.random() * 0.5 + 0.5),
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          size: randomSize,
        };
      });

      // Animate confetti
      confettiPieces.current.forEach((piece) => {
        const fallDuration = Math.random() * 1000 + duration;
        
        Animated.parallel([
          Animated.timing(piece.y, {
            toValue: SCREEN_HEIGHT + 20,
            duration: fallDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotate, {
            toValue: Math.random() * 10,
            duration: fallDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Fade in and out
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration - 600),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, duration, count, fadeAnim]);

  if (!visible) return null;

  const renderConfettiPiece = (piece: ConfettiPiece) => {
    const animatedStyle = {
      transform: [
        { translateX: piece.x },
        { translateY: piece.y },
        {
          rotate: piece.rotate.interpolate({
            inputRange: [0, 10],
            outputRange: ["0deg", "360deg"],
          }),
        },
        { scale: piece.scale },
      ],
      backgroundColor: piece.color,
      width: piece.size,
      height: piece.size,
    };

    if (piece.shape === "circle") {
      return (
        <Animated.View
          key={piece.id}
          style={[styles.confettiPiece, animatedStyle, styles.circle]}
        />
      );
    } else if (piece.shape === "triangle") {
      return (
        <Animated.View
          key={piece.id}
          style={[styles.confettiPiece, { width: 0, height: 0 }]}
        >
          <Animated.View
            style={[
              styles.triangle,
              {
                borderBottomColor: piece.color,
                borderBottomWidth: piece.size,
                borderLeftWidth: piece.size / 2,
                borderRightWidth: piece.size / 2,
                transform: [
                  { translateX: piece.x },
                  { translateY: piece.y },
                  {
                    rotate: piece.rotate.interpolate({
                      inputRange: [0, 10],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                  { scale: piece.scale },
                ],
              },
            ]}
          />
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key={piece.id}
        style={[styles.confettiPiece, animatedStyle]}
      />
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents="none"
    >
      {confettiPieces.current.map(renderConfettiPiece)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confettiPiece: {
    position: "absolute",
  },
  circle: {
    borderRadius: 50,
  },
  triangle: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
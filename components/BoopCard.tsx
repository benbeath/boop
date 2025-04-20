import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react-native";

export type BoopStatus = "completed" | "pending" | "deleted";

interface BoopCardProps {
  retailer: string;
  date: string;
  points: number;
  status: BoopStatus;
  image?: string;
  onPress?: () => void;
}

export const BoopCard = ({
  retailer,
  date,
  points,
  status,
  image,
  onPress,
}: BoopCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return colors.success;
      case "pending":
        return colors.primary;
      case "deleted":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color={colors.success} />;
      case "pending":
        return <Clock size={16} color={colors.primary} />;
      case "deleted":
        return <XCircle size={16} color={colors.error} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "deleted":
        return "Deleted";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View
              style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}
            />
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.retailer}>{retailer}</Text>
          <View style={styles.dateContainer}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.statusContainer}>
            {getStatusIcon()}
            <Text
              style={[styles.statusText, { color: getStatusColor() }]}
            >
              {getStatusText()}
            </Text>
          </View>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{points}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flexDirection: "row",
    padding: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  retailer: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  pointsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 12,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  pointsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
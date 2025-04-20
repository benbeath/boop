import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Logo } from "@/components/Logo";
import { BoopCard, BoopStatus } from "@/components/BoopCard";
import { useAuthStore } from "@/store/auth-store";
import { useBoopStore } from "@/store/boop-store";
import { Coins } from "lucide-react-native";

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { boops } = useBoopStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<BoopStatus | "all">("all");

  // Filter boops based on active tab
  const filteredBoops = activeTab === "all" 
    ? boops 
    : boops.filter(boop => boop.status === activeTab);

  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app, you would fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderTabButton = (tab: BoopStatus | "all", label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.activeTabButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Logo size="medium" />
        <View style={styles.pointsContainer}>
          <Coins size={20} color={colors.primary} />
          <Text style={styles.pointsText}>{user?.points || 0} points</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          {renderTabButton("all", "All")}
          {renderTabButton("completed", "Completed")}
          {renderTabButton("pending", "Pending")}
          {renderTabButton("deleted", "Deleted")}
        </View>

        <View style={styles.boopsContainer}>
          <Text style={styles.boopsTitle}>My Boops</Text>

          {filteredBoops && filteredBoops.length > 0 ? (
            <FlatList
              data={filteredBoops}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BoopCard
                  retailer={item.retailer}
                  date={item.date}
                  points={item.points}
                  status={item.status}
                  image={item.image}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.boopsList}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={colors.primary}
                />
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No boops found</Text>
              <Text style={styles.emptySubtext}>
                Start scanning QR codes to earn discounts!
              </Text>
            </View>
          )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#121212", // Changed to dark color for better readability
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.card,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  activeTabButtonText: {
    color: "#FFFFFF",
  },
  boopsContainer: {
    flex: 1,
  },
  boopsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  boopsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  boopsList: {
    paddingBottom: 100, // Add padding for the tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
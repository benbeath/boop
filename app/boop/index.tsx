import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useBoopStore } from "@/store/boop-store";
import { X, Scan, RefreshCcw } from "lucide-react-native";

export default function BoopScanScreen() {
  const router = useRouter();
  const { scanQrCode, isLoading, error, clearError } = useBoopStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setScanError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setScanError(null);
    
    try {
      // For testing, we'll accept any QR code and assign a random retailer
      const retailers = ["Nike", "Adidas", "Apple", "Amazon"];
      const randomRetailer = retailers[Math.floor(Math.random() * retailers.length)];
      
      await scanQrCode(`retailer:${randomRetailer}`);
      
      // Navigate to the retailer screen
      router.push("/boop/retailer");
    } catch (error) {
      console.error("Error scanning QR code:", error);
      setScanError("Failed to process QR code. Please try again.");
      setScanned(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleRetry = () => {
    setScanned(false);
    setScanError(null);
  };

  // Mock scan for demo purposes
  const handleMockScan = async () => {
    const retailers = ["Nike", "Adidas", "Apple", "Amazon"];
    const randomRetailer = retailers[Math.floor(Math.random() * retailers.length)];
    
    await scanQrCode(`retailer:${randomRetailer}`);
    router.push("/boop/retailer");
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Scan QR Code" showBackButton />
        
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera to scan QR codes.
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {scanError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Scan Error</Text>
              <Text style={styles.errorMessage}>{scanError}</Text>
              <View style={styles.errorButtons}>
                <Button
                  title="Try Again"
                  onPress={handleRetry}
                  icon={<RefreshCcw size={20} color="#FFFFFF" />}
                  style={styles.errorButton}
                />
                <Button
                  title="Go Back"
                  onPress={handleClose}
                  variant="outline"
                  style={styles.errorButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.scanCorner, styles.topLeft]} />
                <View style={[styles.scanCorner, styles.topRight]} />
                <View style={[styles.scanCorner, styles.bottomLeft]} />
                <View style={[styles.scanCorner, styles.bottomRight]} />
              </View>
              <Text style={styles.scanText}>
                Align the QR code within the frame
              </Text>
            </View>
          )}
          
          <View style={styles.mockScanContainer}>
            <Button
              title="Simulate Scan (Demo)"
              onPress={handleMockScan}
              variant="secondary"
            />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 8,
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderRadius: 16,
    position: "relative",
  },
  scanCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: colors.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  scanText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 24,
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    width: "100%",
  },
  mockScanContainer: {
    padding: 24,
    marginBottom: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
  },
  errorButtons: {
    width: "100%",
  },
  errorButton: {
    marginBottom: 12,
  },
});
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Boop {
  id: string;
  retailer: string;
  date: string;
  points: number;
  status: "completed" | "pending" | "deleted";
  image?: string;
}

interface BoopState {
  boops: Boop[];
  currentBoop: {
    retailer: string;
    discount: string;
    images: string[];
    selectedImage: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  scanQrCode: (qrData: string) => Promise<void>;
  selectImage: (image: string) => void;
  shareBoop: () => Promise<void>;
  deleteBoop: (id: string) => Promise<void>;
  clearCurrentBoop: () => void;
  clearError: () => void;
}

// Hard-coded mock data that will always be available
const MOCK_BOOPS: Boop[] = [
  {
    id: "boop-1",
    retailer: "Nike",
    date: "2023-06-15",
    points: 50,
    status: "completed",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: "boop-2",
    retailer: "Adidas",
    date: "2023-06-10",
    points: 30,
    status: "completed",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
  },
  {
    id: "boop-3",
    retailer: "Apple",
    date: "2023-06-05",
    points: 100,
    status: "pending",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
  }
];

const mockRetailers = [
  {
    name: "Nike",
    discount: "15% off your purchase",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c",
    ],
  },
  {
    name: "Adidas",
    discount: "20% off your purchase",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f",
      "https://images.unsplash.com/photo-1539185441755-769473a23570",
    ],
  },
  {
    name: "Apple",
    discount: "10% off accessories",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
      "https://images.unsplash.com/photo-1585565804112-f201f68c48b4",
    ],
  },
  {
    name: "Amazon",
    discount: "Free shipping on your next order",
    images: [
      "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2",
      "https://images.unsplash.com/photo-1605752540122-271ddb14b604",
      "https://images.unsplash.com/photo-1620288627223-53302f4e8c74",
    ],
  },
];

// Create the store with persistence
export const useBoopStore = create<BoopState>((set, get) => ({
  // Always initialize with mock data
  boops: MOCK_BOOPS,
  currentBoop: null,
  isLoading: false,
  error: null,

  scanQrCode: async (qrData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo, we'll parse the QR code data to get the retailer
      const retailerName = qrData.split(":")[1];
      
      // Find the retailer in our mock data
      const retailer = mockRetailers.find(r => 
        r.name.toLowerCase() === retailerName?.toLowerCase()
      );
      
      if (retailer) {
        set({
          currentBoop: {
            retailer: retailer.name,
            discount: retailer.discount,
            images: retailer.images,
            selectedImage: retailer.images[0],
          },
          isLoading: false,
        });
      } else {
        set({
          error: "Invalid QR code or retailer not found",
          isLoading: false,
        });
      }
    } catch (error) {
      set({ error: "Failed to scan QR code", isLoading: false });
    }
  },

  selectImage: (image) => {
    const { currentBoop } = get();
    if (currentBoop) {
      set({
        currentBoop: {
          ...currentBoop,
          selectedImage: image,
        },
      });
    }
  },

  shareBoop: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const { currentBoop, boops } = get();
      if (!currentBoop || !currentBoop.selectedImage) {
        throw new Error("No image selected");
      }
      
      // Create a new boop
      const newBoop: Boop = {
        id: `boop-${Date.now()}`,
        retailer: currentBoop.retailer,
        date: new Date().toISOString().split("T")[0],
        points: Math.floor(Math.random() * 50) + 20, // Random points between 20-70
        status: "completed",
        image: currentBoop.selectedImage,
      };
      
      set({
        boops: [newBoop, ...boops],
        isLoading: false,
      });
      
      return;
    } catch (error) {
      set({ error: "Failed to share boop", isLoading: false });
    }
  },

  deleteBoop: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const { boops } = get();
      
      // Find the boop and mark it as deleted
      const updatedBoops = boops.map(boop => 
        boop.id === id ? { ...boop, status: "deleted" as const } : boop
      );
      
      set({ boops: updatedBoops, isLoading: false });
    } catch (error) {
      set({ error: "Failed to delete boop", isLoading: false });
    }
  },

  clearCurrentBoop: () => {
    set({ currentBoop: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
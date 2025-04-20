import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { colors } from "@/constants/colors";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface ImageGalleryProps {
  images: string[];
  onSelectImage: (image: string) => void;
}

export const ImageGallery = ({ images, onSelectImage }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get("window").width;

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    onSelectImage(images[index]);
    
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      handleSelectImage(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      handleSelectImage(selectedIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainImageContainer}>
        <Image
          source={{ uri: images[selectedIndex] }}
          style={styles.mainImage}
        />
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              selectedIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={selectedIndex === 0}
          >
            <ChevronLeft
              size={24}
              color={selectedIndex === 0 ? colors.textSecondary : colors.text}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.navButton,
              selectedIndex === images.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={selectedIndex === images.length - 1}
          >
            <ChevronRight
              size={24}
              color={
                selectedIndex === images.length - 1
                  ? colors.textSecondary
                  : colors.text
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.galleryTitle}>Select an image to share</Text>
      
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.thumbnailList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.thumbnailContainer,
              index === selectedIndex && styles.selectedThumbnail,
            ]}
            onPress={() => handleSelectImage(index)}
          >
            <Image source={{ uri: item }} style={styles.thumbnail} />
          </TouchableOpacity>
        )}
        getItemLayout={(_, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        initialScrollIndex={selectedIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  mainImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  navigationButtons: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.text,
  },
  thumbnailList: {
    paddingVertical: 8,
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderColor: colors.primary,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
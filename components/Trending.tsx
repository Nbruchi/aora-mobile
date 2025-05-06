import React, { useCallback, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  View,
  Pressable
} from "react-native";
import { useGetImagesQuery } from "@/store/slices/image/imageAPI";
import { API_CONFIG } from "@/config";

const Trending = () => {
  const { data: images, isLoading } = useGetImagesQuery();
  const [visible, setVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  // Utility function to get image URL
  const getImageUrl = (imageId: string) => {
    if (!imageId) return 'https://via.placeholder.com/300';
    return `${API_CONFIG.baseUrl}/images/${imageId}`;
  };

  const openModal = useCallback((idx: number) => {
    setZoomIndex(idx);
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    setZoomIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setZoomIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const showNext = useCallback(() => {
    setZoomIndex(prev =>
      (prev !== null && images && prev < images.length - 1) ? prev + 1 : prev
    );
  }, [images]);

  if (isLoading || !images) return null;

  return (
    <View className="h-[120px]">
      <FlatList
        data={images}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => openModal(index)} activeOpacity={0.8}>
            <Image
              source={{ uri: getImageUrl(item._id) }}
              className="w-24 h-24 rounded-lg mr-3 bg-gray-400"
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={{paddingHorizontal: 16}}
      />

      <Modal
        visible={visible}
        transparent
        onRequestClose={closeModal}
        animationType="fade"
      >
        <Pressable className="flex-1 bg-[rgba(20,20,20,0.85)] justify-center items-center" onPress={closeModal}>
          {/* Prevent click-throughs on image/navigators */}
          <Pressable className="max-w-full max-h-[85%] flex-row items-center" onPress={() => {}}>
            {zoomIndex !== null && images[zoomIndex] && (
              <>
                {/* Navigation buttons */}
                {zoomIndex > 0 && (
                  <TouchableOpacity 
                    className="absolute left-0 z-[5] p-4 h-full justify-center" 
                    onPress={showPrev}
                  >
                    <View className="w-8 h-8 items-center justify-center">
                      <View className="border-l-8 border-t-8 border-b-8 border-l-white border-t-transparent border-b-transparent w-0 h-0" />
                    </View>
                  </TouchableOpacity>
                )}
                <Image
                  source={{ uri: getImageUrl(images[zoomIndex]._id) }}
                  className="w-[85%] h-[70%] rounded-xl bg-[#222]"
                  resizeMode="contain"
                />
                {zoomIndex < images.length - 1 && (
                  <TouchableOpacity 
                    className="absolute right-0 z-[5] p-4 h-full justify-center" 
                    onPress={showNext}
                  >
                    <View className="w-8 h-8 items-center justify-center">
                      <View className="border-r-8 border-t-8 border-b-8 border-r-white border-t-transparent border-b-transparent w-0 h-0" />
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Trending;

import { useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import ImageOrVideoCell from "../components/ImageOrVideoCell";
import { getMediaType, MediaType } from "../utils/media";
import { saveFileToDocumentDirectory } from "../utils/documentDirectory";

type Media = {
  name: string;
  uri: string;
  type: MediaType;
};

export default function HomeScreen() {
  const [images, setImages] = useState<Media[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  const loadFiles = async () => {
    if (!FileSystem.documentDirectory) return;

    const result = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );

    setImages(
      result.map((file) => ({
        name: file,
        uri: FileSystem.documentDirectory + file,
        type: getMediaType(file),
      }))
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled || !result.assets) return;
    const fileName = result.assets[0].uri.split("/").pop() || "";
    const newImage: Media = {
      name: fileName,
      uri: result.assets[0].uri,
      type: getMediaType(result.assets[0].uri),
    };
    setImages((prev) => [...prev, newImage]);
    await saveFileToDocumentDirectory(newImage.uri);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={3}
        contentContainerStyle={{ gap: 1 }}
        columnWrapperStyle={{ gap: 1 }}
        style={{ padding: 4 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ImageOrVideoCell item={item} />}
      />

      <View style={styles.cameraIconContainer}>
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <MaterialIcons name="insert-photo" size={28} color="white" />
        </TouchableOpacity>
        <Link href="/camera" asChild>
          <TouchableOpacity style={styles.cameraIcon}>
            <MaterialIcons name="photo-camera" size={28} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraIcon: {
    backgroundColor: "royalblue",
    borderRadius: 52,
    padding: 16,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 28,
    right: 20,
    gap: 10,
  },
});

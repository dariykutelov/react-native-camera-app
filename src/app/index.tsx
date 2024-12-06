import { Link, useFocusEffect } from "expo-router";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { useCallback, useState } from "react";
import { getMediaType, MediaType } from "../utils/media";
import Video from "expo-av/build/Video";
import { ResizeMode } from "expo-av/build/Video.types";

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

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={3}
        contentContainerStyle={{ gap: 1 }}
        columnWrapperStyle={{ gap: 1 }}
        style={{ padding: 5 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={`/${item.name}`} asChild>
            <Pressable style={styles.imageContainer}>
              {item.type === "image" ? (
                <Image source={{ uri: item.uri }} style={styles.image} />
              ) : (
                <>
                  <Video
                    source={{ uri: item.uri }}
                    style={styles.image}
                    shouldPlay={true}
                    isLooping={true}
                    resizeMode={ResizeMode.COVER}
                    positionMillis={100}
                  />
                  <MaterialIcons
                    name="play-circle"
                    size={30}
                    color="white"
                    style={{ position: "absolute", top: 4, left: 4 }}
                  />
                </>
              )}
            </Pressable>
          </Link>
        )}
      />
      <Link href="/camera" asChild>
        <TouchableOpacity style={styles.cameraIcon}>
          <MaterialIcons name="photo-camera" size={30} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraIcon: {
    backgroundColor: "royalblue",
    borderRadius: 50,
    padding: 15,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  imageContainer: {
    flex: 1,
    maxWidth: "33.33%",
  },
  image: {
    aspectRatio: 3 / 4,
    borderRadius: 5,
  },
});

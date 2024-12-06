import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Image, StyleSheet, Pressable } from "react-native";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { getMediaType } from "../utils/media";
import Video from "expo-av/build/Video";
import { ResizeMode } from "expo-av/build/Video.types";

export default function ImageScreen() {
  const { imageId } = useLocalSearchParams();
  const fullUri = (FileSystem.documentDirectory || "") + (imageId || "");
  const mediaType = getMediaType(fullUri);

  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Media",
          headerRight: () => (
            <View style={{ gap: 10, flexDirection: "row" }}>
              <MaterialIcons
                onPress={() => {}}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />
      {mediaType === "image" ? (
        <Image
          source={{ uri: fullUri }}
          resizeMode="cover"
          style={styles.image}
        />
      ) : (
        <Video
          source={{ uri: fullUri }}
          style={styles.image}
          shouldPlay={true}
          isLooping={true}
          resizeMode={ResizeMode.COVER}
          useNativeControls={true}
        />
      )}
      <View style={styles.footer}>
        <Pressable onPress={onDelete}>
          <MaterialIcons
            onPress={() => {
              console.warn("Delete");
              onDelete();
            }}
            name="delete"
            size={26}
            color="crimson"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  footer: {
    position: "absolute",
    paddingBottom: 50,
    paddingTop: 16,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
});

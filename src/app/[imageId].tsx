import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Image, StyleSheet, Pressable, Button } from "react-native";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { getMediaType } from "../utils/media";
import { VideoView } from "expo-video";
import { useVideo } from "../hooks/useVideo";
import DisplayImage from "../components/DisplayImage";
import * as MediaLibrary from "expo-media-library";
export default function ImageScreen() {
  const { imageId } = useLocalSearchParams();
  const fullUri = (FileSystem.documentDirectory || "") + (imageId || "");
  const mediaType = getMediaType(fullUri);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const { player, isPlaying, togglePlay } = useVideo(fullUri);

  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
  };

  const onSave = async () => {
    console.log("save to media library");
    if (!permissionResponse?.granted) {
      await requestPermission();
    }
    await MediaLibrary.createAssetAsync(fullUri);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Media",
          headerRight: () => (
            <View style={{ gap: 10, flexDirection: "row" }}>
              <MaterialIcons
                onPress={onSave}
                name="save"
                size={26}
                color="dimgray"
              />
            </View>
          ),
        }}
      />
      {mediaType === "image" ? (
        <DisplayImage
          item={{ name: imageId as string, uri: fullUri, type: mediaType }}
        />
      ) : (
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="cover"
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
        {mediaType === "video" && (
          <Button title={isPlaying ? "Pause" : "Play"} onPress={togglePlay} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
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

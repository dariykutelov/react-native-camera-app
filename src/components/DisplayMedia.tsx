import { View, Button, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "expo-av/build/Video";
import DisplayImage from "./DisplayImage";
import { useCamera } from "../context/CameraProvider";
import { router } from "expo-router";
import { saveFileToDocumentDirectory } from "../utils/documentDirectory";

export function DisplayMedia() {
  const { picture, video, clearMedia } = useCamera();

  const saveFile = async () => {
    const uri = picture?.uri || video;
    if (!uri) return;
    await saveFileToDocumentDirectory(uri);
    clearMedia();
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {picture && (
          <DisplayImage
            item={{ name: "capture", uri: picture.uri, type: "image" }}
          />
        )}
        {video && (
          <Video
            source={{ uri: video }}
            style={styles.media}
            shouldPlay={true}
            isLooping={true}
          />
        )}
      </View>
      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <Button title="Save" onPress={saveFile} />
      </SafeAreaView>
      <MaterialIcons
        onPress={clearMedia}
        name="close"
        size={35}
        color="white"
        style={styles.closeButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  mediaContainer: {
    flex: 1,
  },
  media: {
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: "#00000099",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
});

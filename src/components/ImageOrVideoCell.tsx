import { Link } from "expo-router";
import { StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { VideoView } from "expo-video";
import { useVideo } from "../hooks/useVideo";
import { Media } from "../types/Media";
import DisplayImage from "./DisplayImage";

export default function ImageOrVideoCell({ item }: { item: Media }) {
  const { player } = useVideo(item.uri);

  return (
    <Link href={`/${item.name}`} asChild>
      <Pressable style={styles.imageContainer}>
        {item.type === "image" ? (
          <DisplayImage item={item} isCell />
        ) : (
          <>
            <VideoView
              style={styles.video}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              contentFit="cover"
              nativeControls={true}
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
  video: {
    aspectRatio: 3 / 4,
    borderRadius: 5,
  },
});

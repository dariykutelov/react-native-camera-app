import { Image, StyleSheet } from "react-native";
import { Media } from "../types/Media";

export default function DisplayImage({
  item,
  isCell = false,
}: {
  item: Media;
  isCell?: boolean;
}) {
  return (
    <Image
      source={{ uri: item.uri }}
      style={isCell ? styles.cellImage : styles.image}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  cellImage: {
    aspectRatio: 3 / 4,
    borderRadius: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

import { useEffect } from "react";
import { Link, router } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useCamera } from "../context/CameraProvider";
import { CameraViewComponent } from "../components/CameraView";
import { DisplayMedia } from "../components/DisplayMedia";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { picture, video } = useCamera();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return <ActivityIndicator />;
  }

  if (picture || video) {
    return <DisplayMedia />;
  }

  return (
    <View style={styles.container}>
      <CameraViewComponent />
      <MaterialIcons
        name="close"
        color="white"
        size={30}
        style={styles.closeIcon}
        onPress={() => router.back()}
      />
      <Link href="/">Back</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeIcon: {
    position: "absolute",
    top: 50,
    left: 20,
  },
});

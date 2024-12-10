import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView as ExpoCameraView } from "expo-camera";
import { useCamera } from "../context/CameraProvider";

export function CameraViewComponent() {
  const {
    camera,
    cameraFacing,
    isRecording,
    onCameraPress,
    startRecording,
    switchCameraFacing,
  } = useCamera();

  return (
    <ExpoCameraView
      ref={camera}
      style={styles.camera}
      facing={cameraFacing}
      mode="video"
    >
      <View style={styles.footer}>
        <View />
        <TouchableOpacity
          onPress={onCameraPress}
          onLongPress={startRecording}
          style={[styles.recordButton, isRecording && styles.recordingButton]}
        />
        <MaterialIcons
          name="flip-camera-ios"
          size={24}
          color="white"
          onPress={switchCameraFacing}
        />
      </View>
    </ExpoCameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    height: "100%",
  },
  footer: {
    marginTop: "auto",
    padding: 20,
    paddingBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
  recordingButton: {
    backgroundColor: "crimson",
  },
});

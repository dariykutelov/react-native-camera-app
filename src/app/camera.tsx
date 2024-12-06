import { useEffect, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { Link, router } from "expo-router";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import path from "path";
import * as FileSystem from "expo-file-system";
import Video from "expo-av/build/Video";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");
  const camera = useRef<CameraView>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [video, setVideo] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return <ActivityIndicator />;
  }

  const switchCameraFacing = () => {
    console.log(cameraFacing);
    setCameraFacing((prev) => {
      return prev === "back" ? "front" : "back";
    });
  };

  const takePicture = async () => {
    const result = await camera.current?.takePictureAsync();
    setPicture(result);
  };

  const saveFile = async (uri: string) => {
    const filename = path.parse(uri).base;

    await FileSystem.copyAsync({
      from: uri,
      to: FileSystem.documentDirectory + filename,
    });
    setPicture(undefined);
    setVideo(undefined);
    router.push("/");
  };

  const onCameraPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      takePicture();
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    const result = await camera.current?.recordAsync({ maxDuration: 10 });
    setVideo(result?.uri);
    setIsRecording(false);
  };

  const stopRecording = () => {
    camera.current?.stopRecording();
    setIsRecording(false);
  };

  if (picture || video) {
    return (
      <View style={{ flex: 1 }}>
        {picture && (
          <Image source={{ uri: picture.uri }} style={styles.takenPhoto} />
        )}
        {video && (
          <Video
            source={{ uri: video }}
            style={styles.takenPhoto}
            shouldPlay={true}
            isLooping={true}
          />
        )}
        <View style={{ padding: 10 }}>
          {(picture || video) && (
            <SafeAreaView edges={["bottom"]}>
              <Button
                title="Save"
                onPress={() => {
                  const uri = picture?.uri || video;
                  if (uri) saveFile(uri);
                }}
              />
            </SafeAreaView>
          )}
        </View>
        <MaterialIcons
          onPress={() => {
            setPicture(undefined);
          }}
          name="close"
          size={35}
          color="white"
          style={{ position: "absolute", top: 50, left: 20 }}
        />
      </View>
    );
  }

  return (
    <View>
      <CameraView
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
      </CameraView>

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
  camera: {
    width: "100%",
    height: "100%",
  },
  closeIcon: {
    position: "absolute",
    top: 50,
    left: 20,
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
  takenPhoto: {
    width: "100%",
    flex: 1,
  },
});

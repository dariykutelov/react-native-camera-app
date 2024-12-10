import { Stack } from "expo-router";
import { CameraProvider } from "../context/CameraProvider";

export default function Layout() {
  return (
    <CameraProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Gallery" }} />
        <Stack.Screen name="camera" options={{ title: "Camera" }} />
      </Stack>
    </CameraProvider>
  );
}

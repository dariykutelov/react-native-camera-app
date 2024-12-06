import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerTintColor: "royalblue" }}
      />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
    </Stack>
  );
}

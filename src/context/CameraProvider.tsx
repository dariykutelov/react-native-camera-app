import { useRef, useState, useContext } from "react";
import { CameraCapturedPicture, CameraType, CameraView } from "expo-camera";
import React from "react";
import type { ReactNode } from "react";

type CameraContextType = {
  camera: React.RefObject<CameraView>;
  onCameraPress: () => void;
  picture?: CameraCapturedPicture;
  takePicture: () => Promise<void>;
  cameraFacing: CameraType;
  switchCameraFacing: () => void;
  setPicture: (picture?: CameraCapturedPicture) => void;
  video?: string;
  setVideo: (video?: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearMedia: () => void;
};

const CameraContext = React.createContext<CameraContextType | null>(null);

function useCameraState() {
  const camera = useRef<CameraView>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [video, setVideo] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");

  // Camera
  const switchCameraFacing = () => {
    setCameraFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const onCameraPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      takePicture();
    }
  };

  // Photo
  const takePicture = async () => {
    const result = await camera.current?.takePictureAsync();
    setPicture(result);
  };

  // Video
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

  // Clear
  const clearMedia = () => {
    setPicture(undefined);
    setVideo(undefined);
  };

  return {
    picture,
    setPicture,
    video,
    setVideo,
    isRecording,
    setIsRecording,
    clearMedia,
    cameraFacing,
    switchCameraFacing,
    takePicture,
    startRecording,
    stopRecording,
    camera,
    onCameraPress,
  };
}

export function CameraProvider({ children }: { children: ReactNode }) {
  const value = useCameraState();
  return (
    <CameraContext.Provider value={value}>{children}</CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCamera must be used within a CameraProvider");
  }
  return context;
}

import { useEffect, useState } from "react";
import { useVideoPlayer } from "expo-video";

export const useVideo = (uri: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(uri);

  useEffect(() => {
    if (player) {
      player.loop = true;
      player.play();
      setIsPlaying(true);
    }
  }, [player]);

  const play = () => {
    player?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    player?.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    player,
    isPlaying,
    play,
    pause,
    togglePlay,
  };
};

import { forwardRef } from 'react';

const VideoPlayer = forwardRef(({ onPlay, onEnded, video }, ref) => {
  if (!video || !video.path) {
    return null;  // or return a loading component or some default content.
  }

  return (
    <video
      ref={ref}
      onPlay={onPlay}
      onEnded={onEnded}
      src={video.path}
      controls
    />
  );
});

export default VideoPlayer;

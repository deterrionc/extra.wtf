import { forwardRef } from 'react';

const VideoPlayer = forwardRef(({ onEnd, onStart, video, style, autoPlay }, ref) => {
  return (
    <video
      ref={ref}
      onPlay={onStart}
      onEnded={onEnd}
      className="fixed z-10 inset-0 w-screen h-screen object-cover"
      autoPlay={autoPlay}
      controls={true}
      style={style}
      preload='auto'
    >
      <source src={`/${video?.path}`} type="video/mp4" />
    </video>
  );
});

export default VideoPlayer;

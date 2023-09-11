const VideoFooter = ({ channel, video }) => {
  return (
    <div className="absolute right-0 bottom-5 p-3 z-20 bg-white bg-opacity-50">
      <div className="flex justify-center">
        <img
          src={`/${channel.image}`}
          alt={channel.name}
          className="w-24 sm:w-36 lg:w-48 aspect-[3/2]"
        />
      </div>
      <div className="text-center mb-0">{video.name}</div>
    </div>
  );
};

export default VideoFooter;

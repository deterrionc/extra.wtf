import { Link } from 'react-router-dom';
import { FaIcon } from '../../../../container/atoms/FaIcon';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getChannel,
  getChannelVideos,
  updateVideoPlayedAt,
  getNextVideo
} from '../../../../actions/channel';

const ChannelRoom = ({
  getChannel,
  channel,
  getChannelVideos,
  getNextVideo,
  updateVideoPlayedAt,
  videos
}) => {
  const params = useParams();
  const channelID = params.id;

  const [channelVideos, setChannelVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);

  const videoRefs = useRef([null, null]);

  useEffect(() => {
    getChannelVideos();
  }, [getChannelVideos]);

  useEffect(() => {
    getChannel(channelID);
  }, [getChannel, channelID]);

  useEffect(() => {
    if (videos.length > 0) {
      setChannelVideos(videos);
      setCurrentVideoIndex(0);
      setNextVideoIndex(1);
    }
  }, [videos]);

  useEffect(() => {
    if (channelVideos.length === 1) {
      getNextVideo(channelVideos[0]._id).then((nextVideo) => {
        setChannelVideos((oldVideos) => [...oldVideos, nextVideo]);
      });
    }
  }, [channelVideos, getNextVideo]);

  const handleVideoEnd = async () => {
    console.log(channelVideos)
    await updateVideoPlayedAt(channelVideos[currentVideoIndex]._id);

    setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    setNextVideoIndex((prevIndex) => prevIndex + 1);

    const currentVideoRef = videoRefs.current[currentVideoIndex % 2];
    const nextVideoRef = videoRefs.current[nextVideoIndex % 2];

    currentVideoRef.style.display = 'none';
    nextVideoRef.style.display = 'block';

    if (nextVideoIndex === channelVideos.length - 1) {
      getNextVideo(channelVideos[nextVideoIndex]._id).then((nextVideo) => {
        setChannelVideos((oldVideos) => [...oldVideos, nextVideo]);
      });
    }

    if (nextVideoRef.src !== `/${channelVideos[nextVideoIndex]?.path}`) {
      nextVideoRef.src = `/${channelVideos[nextVideoIndex]?.path}`;
      nextVideoRef.load();
    }

    nextVideoRef.play().catch((error) => console.log(error));

    if (channelVideos.length > 5) {
      let _channelVideos = [...channelVideos]
      _channelVideos.shift()
      console.log(channelVideos)
      setChannelVideos(_channelVideos)
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
      setNextVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="relative z-0 min-h-screen">
      <Link to="/video-channels" className="absolute top-0 left-0 p-1 z-20">
        <h5 className="m-1 text-xs sm:text-sm lg:text-lg font-bold leading-6">
          Channels <FaIcon iconName="fa-arrow-right" />
        </h5>
      </Link>

      {channelVideos.length > 0 && (
        <>
          <video
            ref={(el) => (videoRefs.current[0] = el)}
            onEnded={handleVideoEnd}
            className="fixed z-10 inset-0 w-screen h-screen object-cover"
            autoPlay
            controls={true}
            style={{ display: 'block' }}
          >
            <source
              src={`/${channelVideos[currentVideoIndex]?.path}`}
              type="video/mp4"
            />
          </video>

          <video
            ref={(el) => (videoRefs.current[1] = el)}
            onEnded={handleVideoEnd}
            className="fixed z-10 inset-0 w-screen h-screen object-cover"
            autoPlay
            controls={true}
            style={{ display: 'none' }}
          >
            <source
              src={`/${channelVideos[nextVideoIndex]?.path}`}
              type="video/mp4"
            />
          </video>
        </>
      )}

      <div className="absolute right-0 bottom-5 p-3 z-20 bg-white bg-opacity-50">
        <div className="flex justify-center">
          <img
            src={`/${channel.image}`}
            alt={channel.name}
            className="w-24 sm:w-36 lg:w-48 aspect-[3/2]"
          />
        </div>
        <div className="text-center mb-0">
          {channelVideos[currentVideoIndex]?.name}
        </div>
      </div>
    </div>
  );
};

ChannelRoom.propTypes = {
  getChannel: PropTypes.func.isRequired,
  getChannelVideos: PropTypes.func.isRequired,
  getNextVideo: PropTypes.func.isRequired,
  updateVideoPlayedAt: PropTypes.func.isRequired,
  channel: PropTypes.oneOfType([PropTypes.object, PropTypes.any]).isRequired,
  videos: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  channel: state.channel.channel,
  videos: state.video.videos
});

export default connect(mapStateToProps, {
  getChannel,
  getChannelVideos,
  getNextVideo,
  updateVideoPlayedAt
})(ChannelRoom);

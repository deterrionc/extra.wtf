import { Link } from 'react-router-dom';
import { FaIcon } from '../../../../container/atoms/FaIcon';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getChannel,
  getChannelVideos,
  updateVideoPlayedAt
} from '../../../../actions/channel';

const ChannelRoom = ({
  getChannel,
  channel,
  getChannelVideos,
  updateVideoPlayedAt,
  musics,
  newss,
  videos
}) => {
  const params = useParams();
  const channelID = params.id;

  const [channelVideos, setChannelVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [currentVideoName, setCurrentVideoName] = useState('');

  const videoRef = useRef(null);

  useEffect(() => {
    getChannelVideos();
  }, [getChannelVideos]);

  useEffect(() => {
    getChannel(channelID);
  }, [getChannel, channelID]);

  useEffect(() => {
    videos.length > 0 && setChannelVideos(videos);
    videos.length > 0 && setCurrentVideoIndex(0);
    videos.length > 0 && setCurrentVideoName(videos[0].name);
  }, [videos]);

  const handleVideoEnd = async() => {
    const currentIndex = channelVideos.findIndex(
      (video) => video['path'] === channelVideos[currentVideoIndex]['path']
    );
    let nextVideoIndex;

    await updateVideoPlayedAt(channelVideos[currentVideoIndex]._id)

    if (currentIndex < channelVideos.length - 1) {
      nextVideoIndex = currentIndex + 1;
    } else {
      await getChannelVideos()
      nextVideoIndex = 0;
    }

    setCurrentVideoIndex(nextVideoIndex);
    setCurrentVideoName(channelVideos[nextVideoIndex]['name']);

    if (videoRef.current) {
      videoRef.current.src = `/${channelVideos[nextVideoIndex]['path']}`;
      videoRef.current.load();
      videoRef.current.play();
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
        <video
          ref={videoRef}
          onEnded={handleVideoEnd}
          className="fixed z-10 inset-0 w-screen h-screen object-cover"
          autoPlay
          controls={false}
        >
          <source
            src={`/${channelVideos[currentVideoIndex]['path']}`}
            type="video/mp4"
          />
        </video>
      )}

      <div className="absolute right-0 bottom-5 p-3 z-20 bg-white bg-opacity-50">
        <div className="flex justify-center">
          <img
            src={`/${channel.image}`}
            alt={channel.name}
            className="w-24 sm:w-36 lg:w-48 aspect-[3/2]"
          />
        </div>
        <div className="text-center mb-0">{currentVideoName}</div>
      </div>
    </div>
  );
};

ChannelRoom.propTypes = {
  getChannel: PropTypes.func.isRequired,
  getChannelVideos: PropTypes.func.isRequired,
  updateVideoPlayedAt: PropTypes.func.isRequired,
  channel: PropTypes.oneOfType([PropTypes.object, PropTypes.any]).isRequired
};

const mapStateToProps = (state) => ({
  channel: state.channel.channel,
  newss: state.video.newss,
  musics: state.video.musics,
  videos: state.video.videos
});

export default connect(mapStateToProps, {
  getChannel,
  getChannelVideos,
  updateVideoPlayedAt
})(ChannelRoom);

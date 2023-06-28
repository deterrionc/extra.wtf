import { Link } from 'react-router-dom';
import { FaIcon } from '../../../../container/atoms/FaIcon';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannel } from '../../../../actions/channel';

const ChannelRoom = ({ getChannel, channel }: any) => {
  const params = useParams();
  const channelID = params.id;

  const [channelVideos, setChannelVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getChannel(channelID);
  }, [getChannel, channelID]);

  useEffect(() => {
    channel?.videos?.length && setChannelVideos(channel?.videos);
  }, [channel]);

  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [channelVideos]);

  const handleVideoEnd = () => {
    const currentIndex = channelVideos.findIndex(video => video['path'] === channelVideos[currentVideoIndex]['path']);
    let nextVideoIndex;

    if (currentIndex < channelVideos.length - 1) {
      nextVideoIndex = currentIndex + 1;
    } else {
      nextVideoIndex = 0;
    }

    setCurrentVideoIndex(nextVideoIndex);

    if (videoRef.current) {
      videoRef.current.src = `/${channelVideos[nextVideoIndex]['path']}`;
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  return (
    <div className="py-3">
      <Link to="/video-channels">
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">
          Channels <FaIcon iconName="fa-arrow-right" />
        </h5>
      </Link>

      <div className='flex justify-center'>
        <img src={`/${channel.image}`} alt={channel.name} width='200px' />
      </div>
      <div className='text-center mb-4'>{channel.name}</div>

      {channelVideos.length > 0 && (
        <video
          ref={videoRef}
          onEnded={handleVideoEnd}
          className="min-w-full"
          autoPlay
          controls={false}
        >
          <source src={`/${channelVideos[currentVideoIndex]['path']}`} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

ChannelRoom.propTypes = {
  getChannel: PropTypes.func.isRequired,
  channel: PropTypes.oneOfType([PropTypes.object, PropTypes.any]).isRequired
};

const mapStateToProps = (state: any) => ({
  channel: state.channel.channel
});

export default connect(mapStateToProps, { getChannel })(ChannelRoom);

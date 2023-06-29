import { Link } from 'react-router-dom';
import { FaIcon } from '../../../../container/atoms/FaIcon';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannel, getChannelVideos } from '../../../../actions/channel';

const ChannelRoom = ({ getChannel, channel, getChannelVideos, musics, newss }) => {
  const params = useParams();
  const channelID = params.id;

  const [channelNewss, setChannelNewss] = useState([])
  const [channelMusics, setChannelMusics] = useState([])

  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const [currentVideoName, setCurrentVideoName] = useState("")

  const videoRef = useRef(null);

  useEffect(() => {
    getChannelVideos()
  }, [getChannelVideos])

  useEffect(() => {
    getChannel(channelID);
  }, [getChannel, channelID]);

  useEffect(() => {
    musics.length > 0 && setChannelMusics(musics)
    musics.length > 0 && setCurrentMusicIndex(0)
    musics.length > 0 && setCurrentVideoName(musics[0].name)
    newss.length > 0 && setChannelNewss(newss)
    newss.length > 0 && setCurrentNewsIndex(0)
  }, [musics, newss])

  const handleVideoEnd = () => {
    const currentIndex = channelMusics.findIndex(
      (video) => video['path'] === channelMusics[currentMusicIndex]['path']
    );
    let nextMusicIndex;

    if (currentIndex < channelMusics.length - 1) {
      nextMusicIndex = currentIndex + 1;
    } else {
      nextMusicIndex = 0;
    }

    setCurrentMusicIndex(nextMusicIndex);
    setCurrentVideoName(channelMusics[nextMusicIndex]['name'])

    if (videoRef.current) {
      videoRef.current.src = `/${channelMusics[nextMusicIndex]['path']}`;
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

      {channelMusics.length > 0 && (
        <video
          ref={videoRef}
          onEnded={handleVideoEnd}
          className="fixed z-10 inset-0 w-screen h-screen object-cover"
          autoPlay
          controls={false}
        >
          <source
            src={`/${channelMusics[currentMusicIndex]['path']}`}
            type="video/mp4"
          />
        </video>
      )}

      <div className="absolute right-0 bottom-5 p-3 z-20 bg-white bg-opacity-50">
        <div className="flex justify-center">
          <img src={`/${channel.image}`} alt={channel.name} className="w-24 sm:w-36 lg:w-48 aspect-[3/2]" />
        </div>
        <div className="text-center mb-0">{currentVideoName}</div>
      </div>
    </div>
  );
};

ChannelRoom.propTypes = {
  getChannel: PropTypes.func.isRequired,
  getChannelVideos: PropTypes.func.isRequired,
  channel: PropTypes.oneOfType([PropTypes.object, PropTypes.any]).isRequired
};

const mapStateToProps = (state) => ({
  channel: state.channel.channel,
  newss: state.video.newss,
  musics: state.video.musics
});

export default connect(mapStateToProps, { getChannel, getChannelVideos })(ChannelRoom);

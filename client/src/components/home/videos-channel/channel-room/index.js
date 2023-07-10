import { Link } from "react-router-dom";
import { FaIcon } from "../../../../container/atoms/FaIcon";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getChannelBySlug,
  getChannelVideos,
  updateVideoPlayedAt,
  getNextVideo,
} from "../../../../actions/channel";

const ChannelRoom = ({
  getChannelBySlug,
  channel,
  currentCategory,
  currentMinute,
  currentSecond,
  getChannelVideos,
  getNextVideo,
  updateVideoPlayedAt,
  videos,
}) => {
  const params = useParams();
  const channelSlug = params.slug;

  const [channelVideos, setChannelVideos] = useState([]);
  // const [channelVideoLength, setChannelVideoLength] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false)

  const videoRefs = useRef([null, null]);

  const intervalIdRef = useRef(null);
  const intervalIdRef1 = useRef(null)
  const [minuteDifference, setMinuteDifference] = useState(0);
  const [secondDifference, setSecondDifference] = useState(0);

  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    getChannelVideos();
  }, [getChannelVideos]);

  useEffect(() => {
    const now = new Date();
    const clientMinutes = now.getMinutes();
    const serverMinutes = currentMinute % 60;
    const clientSeconds = now.getSeconds();
    const serverSeconds = currentSecond % 60;
    setMinuteDifference((clientMinutes - serverMinutes + 60) % 60);
    setSecondDifference((clientSeconds - serverSeconds + 60) % 60);
  }, [currentMinute, currentSecond]);

  // new useEffect for setting up the timer
  useEffect(() => {
    // clear old timer
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = (now.getMinutes() - minuteDifference) % 60;
      const seconds = now.getSeconds() - secondDifference;

      if (hours >= 6 && hours < 18) {
        if ((minutes === 0 || minutes === 30) && seconds > 0 && !fetched) {
          stopAllVideos();
          getChannelVideos();
          setFetched(true);
        }
      } else {
        if ((minutes === 0) && seconds > 0 && !fetched) {
          stopAllVideos();
          getChannelVideos();
          setFetched(true);
        }
      }

      if ((minutes === 31 || minutes === 1) && fetched) {
        setFetched(false);
      }
    }, 2 * 1000); // check every 5 seconds

    // cleanup function
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [getChannelVideos, minuteDifference, secondDifference, fetched]);

  const stopAllVideos = () => {
    videoRefs.current.forEach((ref) => {
      if (ref) {
        ref.pause();
        ref.src = "";
      }
    });

    setChannelVideos([]);
    setCurrentVideoIndex(0);
    setNextVideoIndex(1);
    videoRefs.current = [null, null];
  };

  useEffect(() => {
    getChannelBySlug(channelSlug);
  }, [getChannelBySlug, channelSlug]);

  useEffect(() => {
    if (videos.length > 0) {
      setChannelVideos(videos);
      // setChannelVideoLength(videos.length)
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
    await updateVideoPlayedAt(channelVideos[currentVideoIndex]._id);

    setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    setNextVideoIndex((prevIndex) => prevIndex + 1);

    const currentVideoRef = videoRefs.current[currentVideoIndex % 2];
    const nextVideoRef = videoRefs.current[nextVideoIndex % 2];

    currentVideoRef.style.display = "none";
    nextVideoRef.style.display = "block";

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

    if (channelVideos.length > 15) {
      let _channelVideos = [...channelVideos];
      _channelVideos.shift();
      setChannelVideos(_channelVideos);
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
      setNextVideoIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    if (channelVideos.length > 0) {
      const currentVideoRef = videoRefs.current[currentVideoIndex % 2];
      if (currentVideoRef.paused) {
        setIsPaused(true)
      } else {
        setIsPaused(false)
      }
    }
  }, [channelVideos, currentVideoIndex, isPaused])

  const playVideo = () => {
    const currentVideoRef = videoRefs.current[currentVideoIndex % 2];
    currentVideoRef.play()
    setIsPaused(false)
  }

  const handleVideoPause = () => {
    setIsPaused(true)
  }

  useEffect(() => {
    // clear old timer
    if (intervalIdRef1.current) {
      clearInterval(intervalIdRef1.current);
    }

    intervalIdRef1.current = setInterval(() => {
      const currentVideoRef = videoRefs.current[currentVideoIndex % 2];
      if (currentVideoRef.paused && isPaused === false) {
        console.log('yes')
        console.log(isPaused)
        setIsPaused(true)
      } else {
        console.log('no')
        setIsPaused(false)
      }
    }, 2 * 1000); // check every 5 seconds

    // cleanup function
    return () => {
      if (intervalIdRef1.current) {
        clearInterval(intervalIdRef1.current);
      }
    };
  }, [currentVideoIndex, nextVideoIndex, isPaused]);

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
            onPause={handleVideoPause}
            className="fixed z-10 inset-0 w-screen h-screen object-cover"
            autoPlay
            controls={true}
            style={{ display: "block" }}
          >
            <source
              src={`/${channelVideos[currentVideoIndex]?.path}`}
              type="video/mp4"
            />
          </video>

          <video
            ref={(el) => (videoRefs.current[1] = el)}
            onEnded={handleVideoEnd}
            onPause={handleVideoPause}
            className="fixed z-10 inset-0 w-screen h-screen object-cover"
            autoPlay
            controls={true}
            style={{ display: "none" }}
          >
            <source
              src={`/${channelVideos[nextVideoIndex]?.path}`}
              type="video/mp4"
            />
          </video>

          {isPaused ? (
            <div className="absolute z-20 inset-0 flex justify-center items-center">
              <button
                onClick={() => playVideo()}
                className="text-9xl text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 20 20"><path fill="gray" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6l8 4l-8 4V6z"/></svg>
              </button>
            </div>
          ) : null}
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
  getChannelBySlug: PropTypes.func.isRequired,
  getChannelVideos: PropTypes.func.isRequired,
  getNextVideo: PropTypes.func.isRequired,
  updateVideoPlayedAt: PropTypes.func.isRequired,
  channel: PropTypes.oneOfType([PropTypes.object, PropTypes.any]).isRequired,
  videos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  channel: state.channel.channel,
  videos: state.video.videos,
  currentCategory: state.video.currentCategory,
  currentMinute: state.video.currentMinute,
  currentSecond: state.video.currentSecond,
});

export default connect(mapStateToProps, {
  getChannelBySlug,
  getChannelVideos,
  getNextVideo,
  updateVideoPlayedAt,
})(ChannelRoom);

import VideoHeader from "./components/VideoHeader";
import ChannelRoomContainer from "./components/ChannelRoomContainer";
import { useRef, createRef, useEffect, useState } from "react";
import videoList from "./utils/videoList.json";
import {
  getFirstVideo,
  getNextVideo,
  getChannelBySlug,
  updateVideoPlayedAt,
} from "../../../../actions/channel";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

const ChannelRoom = ({ getChannelBySlug, updateVideoPlayedAt }) => {
  const params = useParams();
  const channelSlug = params.slug;
  let noPlayFlag = useRef(createRef());
  noPlayFlag.current = true;
  const playerRef = useRef(createRef());
  const video = videoList.music[0];
  const [firstVideo, setFirstVideo] = useState(null);
  const [nextVideo, setNextVideo] = useState(null);
  // const [currentVideoID, setCurrentVideoID] = useState(null);
  const [minuteDifference, setMinuteDifference] = useState(0);
  const [secondDifference, setSecondDifference] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // useEffect(() => {
  //   getChannelBySlug(channelSlug);
  // }, [getChannelBySlug, channelSlug]);

  useEffect(() => {
    // LOAD FIRST VIDEO, SYNC TIME
    async function fetchData() {
      const { video, currentMinute, currentSecond } = await getFirstVideo(
        channelSlug
      );
      setFirstVideo(video);
      setNextVideo(video);

      const now = new Date();
      const clientMinutes = now.getMinutes();
      const serverMinutes = currentMinute % 60;
      const clientSeconds = now.getSeconds();
      const serverSeconds = currentSecond % 60;
      setMinuteDifference((clientMinutes - serverMinutes + 60) % 60);
      setSecondDifference((clientSeconds - serverSeconds + 60) % 60);
    }
    fetchData();
  }, [channelSlug]);

  const playVideo = async (video) => {
    const player = playerRef.current;
    player.src = `/${video.path}`;
    player.muted = false;
    player.autoplay = true;
    // player.load();
    // player
    //   .play()
    //   .then((_) => {
    //     console.log("STARTED");
    //     setIsPaused(false);
    //     noPlayFlag.current = false;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    player.onloadedmetadata = function () {
      player
        .play()
        .then((_) => {
          console.log("STARTED");
          setIsPaused(false);
          noPlayFlag.current = false;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    player.load();
  };

  useEffect(() => {
    // ON FIRST VIDEO LOAD -> AUTOPLAY
    if (firstVideo && noPlayFlag.current && !loaded) {
      console.log("LOAD");
      setLoaded(true);
      playVideo(firstVideo);
    }
  }, [firstVideo, loaded]);

  useEffect(() => {
    const startPlayNews = async () => {
      const response = await getNextVideo(0, "news", channelSlug);
      setNextVideo(response);
      playVideo(response);
    };

    const timerId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = (now.getMinutes() - minuteDifference) % 60;
      const seconds = now.getSeconds() - secondDifference;

      if (hours >= 6 && hours < 18) {
        if ((minutes === 0 || minutes === 30) && seconds > 0 && !fetched) {
          console.log("TIMER");
          startPlayNews();
          setFetched(true);
        }
      } else {
        if (minutes === 0 && seconds > 0 && !fetched) {
          console.log("TIMER");
          startPlayNews();
          setFetched(true);
        }
      }

      if ((minutes === 31 || minutes === 1) && fetched) {
        setFetched(false);
      }
    }, 2 * 1000);

    return () => clearInterval(timerId);
  }, [fetched, minuteDifference, secondDifference, channelSlug]);

  const onVideoStart = async () => {
    console.log("-> START");
    updateVideoPlayedAt(nextVideo._id, channelSlug);
    // setCurrentVideoID(nextVideo._id)
    let _nextVideo = null;
    if (nextVideo.type === "music") {
      _nextVideo = await getNextVideo(nextVideo._id, "music", channelSlug);
    } else if (nextVideo.type === "news") {
      _nextVideo = await getNextVideo(nextVideo._id, "news", channelSlug);
    } else {
      _nextVideo = nextVideo;
    }
    setNextVideo(_nextVideo);
  };

  const onVideoEnd = async () => {
    console.log("-> END");
    playVideo(nextVideo);
  };

  useEffect(() => {
    let showPause = setInterval(() => {
      if (firstVideo && noPlayFlag.current && isPaused === false) {
        const player = playerRef.current;
        if (player.paused) {
          console.log("SHOW PAUSE");
          setIsPaused(true);
        }
      }
    }, 2 * 100);

    // cleanup function
    return () => {
      clearInterval(showPause);
    };
  }, [firstVideo, loaded, isPaused]);

  return (
    <ChannelRoomContainer>
      <VideoHeader />
      {video && (
        <video
          ref={(el) => (playerRef.current = el)}
          onPlay={onVideoStart}
          onEnded={onVideoEnd}
          className="fixed z-10 inset-0 w-screen h-screen object-cover"
          id="videoplayer"
          controls={true}
        />
      )}
      {isPaused ? (
        <div className="absolute z-20 inset-0 flex justify-center items-center m-20">
          <button
            onClick={() => playVideo(firstVideo)}
            className="text-9xl text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 20 20"
            >
              <path
                fill="gray"
                d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6l8 4l-8 4V6z"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </ChannelRoomContainer>
  );
};

const mapStateToProps = (state) => ({
  channel: state.channel.channel,
});

export default connect(mapStateToProps, {
  getChannelBySlug,
  updateVideoPlayedAt,
})(ChannelRoom);

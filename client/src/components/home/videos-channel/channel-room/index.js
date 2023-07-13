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
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const [minuteDifference, setMinuteDifference] = useState(0);
  const [secondDifference, setSecondDifference] = useState(0);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    getChannelBySlug(channelSlug);
  }, [getChannelBySlug, channelSlug]);

  useEffect(() => {
    // LOAD FIRST VIDEO, SYNC TIME
    async function fetchData() {
      const { video, currentMinute, currentSecond } = await getFirstVideo();
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
  }, []);

  const playVideo = async (video) => {
    const player = playerRef.current;
    player.src = `/${video.path}`;
    player.muted = false;
    player.autoplay = true;
    player.load();
    player
      .play()
      .then((_) => {
        console.log("STARTED");
        noPlayFlag.current = false;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // ON FIRST VIDEO LOAD -> AUTOPLAY
    if (firstVideo && noPlayFlag.current) {
      console.log("LOAD");
      playVideo(firstVideo);
    }
  }, [playerRef, firstVideo]);

  useEffect(() => {
    const startPlayNews = async () => {
      const response = await getNextVideo(0, "news");
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
  }, [fetched, minuteDifference, secondDifference]);

  const onVideoStart = async () => {
    console.log("-> START");
    setCurrentVideoID(nextVideo._id)
    let _nextVideo = null;
    if (nextVideo.type === "music") {
      _nextVideo = await getNextVideo(nextVideo._id, "music");
    } else if (nextVideo.type === "news") {
      _nextVideo = await getNextVideo(nextVideo._id, "news");
    } else {
      _nextVideo = nextVideo;
    }
    setNextVideo(_nextVideo);
  };

  const onVideoEnd = async () => {
    console.log("-> END");
    updateVideoPlayedAt(currentVideoID);
    playVideo(nextVideo);
  };

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

import { useRef, useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getFirstVideo,
  getNextVideo,
  updatePlayList,
} from "../../../../actions/nchannel";

import VideoHeader from "./components/VideoHeader";
import ChannelRoomContainer from "./components/ChannelRoomContainer";
import videoList from "./utils/videoList.json";
import { PauseButton } from "./components/PauseButton";

const ChannelRoom = () => {
  const params = useParams();
  const channelSlug = params.slug;
  let noPlayFlag = useRef(true);
  const playerRef = useRef();
  const video = videoList.music[0];
  const [state, setState] = useState({
    firstVideo: null,
    currentVideo: null,  // Add this line
    nextVideo: null,
    minuteDifference: 0,
    secondDifference: 0,
    fetched: false,
    loaded: false,
    isPaused: false,
  });

  const updateState = (changes) => {
    setState(prevState => ({ ...prevState, ...changes }));
  };

  const fetchAndSetVideoData = useCallback(async () => {
    const { video, currentMinute, currentSecond } = await getFirstVideo(
      channelSlug
    );
    const now = new Date();
    const clientMinutes = now.getMinutes();
    const serverMinutes = currentMinute % 60;
    const clientSeconds = now.getSeconds();
    const serverSeconds = currentSecond % 60;
    const minuteDifference = (clientMinutes - serverMinutes + 60) % 60;
    const secondDifference = (clientSeconds - serverSeconds + 60) % 60;

    updateState({
      firstVideo: video,
      nextVideo: video,
      minuteDifference,
      secondDifference,
    });
  }, [channelSlug]);

  useEffect(() => {
    fetchAndSetVideoData();
  }, [fetchAndSetVideoData]);

  const playVideo = useCallback((video) => {
    const player = playerRef.current;
    player.src = `/${video.path}`;
    player.muted = false;
    player.oncanplay = () => {
      player
        .play()
        .then(() => {
          updateState({ isPaused: false });
          noPlayFlag.current = false;
        })
        .catch((err) => console.log(err));
    };
    player.load();
  }, []);

  const startPlayNews = useCallback(async () => {
    const nextVideo = await getNextVideo(0, "news", channelSlug);
    updateState({ nextVideo });
    playVideo(nextVideo);
  }, [channelSlug, playVideo]);

  useEffect(() => {
    if (state.firstVideo && noPlayFlag.current && !state.loaded) {
      updateState({ loaded: true });
      playVideo(state.firstVideo);
    }
  }, [state.firstVideo, state.loaded, playVideo]);

  const onVideoStart = useCallback(async () => {
    let _nextVideo = null;
    if (state.nextVideo.type === "music") {
      _nextVideo = await getNextVideo(state.nextVideo.name, "music", channelSlug);
    } else if (state.nextVideo.type === "news") {
      _nextVideo = await getNextVideo(state.nextVideo.name, "news", channelSlug);
    } else {
      _nextVideo = state.nextVideo;
    }
  
    updateState({ currentVideo: state.nextVideo, nextVideo: _nextVideo }); 
  }, [state.nextVideo, channelSlug]);

  const onVideoEnd = useCallback(() => {
    updatePlayList(channelSlug, state.currentVideo.category, state.currentVideo.name)
    updateState({ currentVideo: state.nextVideo });
    playVideo(state.nextVideo); 
  }, [state.nextVideo, playVideo, channelSlug, state.currentVideo]);

  useEffect(() => {
    let timerId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes() - state.minuteDifference;
      const seconds = now.getSeconds() - state.secondDifference;

      if (hours >= 6 && hours < 18) {
        if (minutes % 30 === 0 && seconds > 0 && !state.fetched) {
          startPlayNews();
          updateState({ fetched: true });
        }
      } else {
        if (minutes % 60 === 0 && seconds > 0 && !state.fetched) {
          startPlayNews();
          updateState({ fetched: true });
        }
      }

      if ((minutes % 60 === 1 || minutes % 30 === 1) && state.fetched) {
        updateState({ fetched: false });
      }
    }, 2000);

    return () => clearInterval(timerId);
  }, [state.fetched, state.minuteDifference, state.secondDifference, startPlayNews]);

  useEffect(() => {
    let showPauseIntervalId = setInterval(() => {
      if (
        state.firstVideo &&
        noPlayFlag.current &&
        playerRef.current.paused &&
        !state.isPaused
      ) {
        updateState({ isPaused: true });
      }
    }, 2000);

    return () => clearInterval(showPauseIntervalId);
  }, [state.firstVideo, state.isPaused]);

  return (
    <ChannelRoomContainer>
      <VideoHeader />
      {video && (
        <video
          ref={playerRef}
          onPlay={onVideoStart}
          onEnded={onVideoEnd}
          className="fixed z-10 inset-0 w-screen h-screen object-cover"
          id="videoplayer"
          controls={true}
        />
      )}
      {state.isPaused && (
        <div className="absolute z-20 inset-0 flex justify-center items-center m-20">
          <button
            onClick={() => playVideo(state.firstVideo)}
            className="text-9xl text-black"
          >
            <PauseButton />
          </button>
        </div>
      )}
    </ChannelRoomContainer>
  );
};

const mapStateToProps = (state) => ({
  channel: state.channel.channel,
});

export default connect(mapStateToProps, {
})(ChannelRoom);

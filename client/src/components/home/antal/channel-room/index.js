import { useParams } from "react-router-dom";
import ChannelRoomContainer from "../../videos-channel/channel-room/components/ChannelRoomContainer";
import VideoHeader from "../../videos-channel/channel-room/components/VideoHeader";
import { useEffect, useRef } from "react";
import api from "../../../../utils/api";
import { setAlert } from "../../../../actions/alert";
import { useDispatch } from "react-redux";

const ChannelRoom = () => {
  const params = useParams();
  const channelID = params.id;
  const playerRef = useRef();
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/antal/get-video");
      if (res.data.success) {
        console.log(res.data.videoPath)
        playVideo(res.data.videoPath)
      } else {
        console.log('error')
        dispatch(setAlert("Server Error!", "error"))
      }
    };

    fetchData();
  }, [channelID, dispatch]);

  const playVideo = (path) => {
    const player = playerRef.current;
    player.src = path;
    player.muted = false;
    player.oncanplay = () => {
      player
        .play()
        .then(() => {
          // updateState({ isPaused: false });
          // noPlayFlag.current = false;
        })
        .catch((err) => console.log(err));
    };
    player.load();
  }

  const onVideoStart = () => {};

  const onVideoEnd = () => {};

  return (
    <ChannelRoomContainer>
      <VideoHeader link="/antal" />
      <video
        ref={playerRef}
        onPlay={onVideoStart}
        onEnded={onVideoEnd}
        className="fixed z-10 inset-0 w-screen h-screen object-cover"
        id="videoplayer"
        controls={true}
      />
    </ChannelRoomContainer>
  );
};

export default ChannelRoom;

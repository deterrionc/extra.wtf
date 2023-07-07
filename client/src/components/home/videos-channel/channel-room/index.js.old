import channel from './utils/channel.json';
import VideoHeader from './components/VideoHeader';
import VideoFooter from './components/VideoFooter';
import ChannelRoomContainer from './components/ChannelRoomContainer';
import { useRef, useState, createRef, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import videoList from './utils/videoList.json';

const ChannelRoom = () => {
  const [videos, setVideos] = useState(videoList.music);
  const [activePlayer, setActivePlayer] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const playerRefs = useRef([createRef(), createRef()]);
  const [autoPlay, setAutoPlay] = useState(true);

  // useEffect(() => {
  //   setVideos();
  // }, [videos]);

  useEffect(() => {
    // Set a timer to update the videos every 5 minutes
    const updateVideo =() => {
      setCurrentVideoIndex(0);
      setVideos(videoList.news);
      const currentPlayer = playerRefs.current[activePlayer];
      console.log(currentPlayer)
      // currentPlayer.pause().then(_ => {
      //   currentPlayer.currentTime = 0
      //   currentPlayer.src = `/${videoList.news[0].path}`;
      // })
      currentPlayer.pause();
      currentPlayer.currentTime = 0;
      // currentPlayer.src = `/${videoList.news[0].path}`;
      // currentPlayer.load();
      // currentPlayer.play();
    }

    const timerId = setInterval(() => {
      updateVideo()
    }, 5 * 2 * 1000); // 5 minutes

    // Return a cleanup function to clear the timer when the component is unmounted
    return () => clearInterval(timerId);
  }, []);

  const onVideoStart = () => {
    preloadNextVideo();
  };

  const onVideoEnd = async () => {
    console.log('-> END');
    setAutoPlay(false);

    // SET CURRENT PLAYER NOT VISIBLE
    const currentPlayer = playerRefs.current[activePlayer];
    currentPlayer.style.display = 'none';

    // SET NEXT PLAYER VISIBLE & PLAY
    const nextPlayer = playerRefs.current[(activePlayer + 1) % 2];
    nextPlayer.style.display = 'block';
    nextPlayer.play();

    // SET ACTIVE PLAYER
    setActivePlayer((activePlayer + 1) % 2);
    setCurrentVideoIndex((currentVideoIndex + 1) % videos.length);
  };

  const preloadNextVideo = () => {
    console.log('-> PRELOAD');
    const nextPlayer = playerRefs.current[(activePlayer + 1) % 2];
    nextPlayer.pause();
    nextPlayer.style.display = 'none';
    nextPlayer.src = `/${videos[(currentVideoIndex + 1) % videos.length].path}`;
    nextPlayer.load();
  };

  return (
    <ChannelRoomContainer>
      <VideoHeader />
      {videos.length > 0 && (
        <>
          <VideoPlayer
            ref={(el) => (playerRefs.current[0] = el)}
            onStart={onVideoStart}
            onEnd={onVideoEnd}
            autoPlay={autoPlay}
            video={videos[0]}
          />
          <VideoPlayer
            ref={(el) => (playerRefs.current[1] = el)}
            onStart={onVideoStart}
            onEnd={onVideoEnd}
            autoPlay={false}
            style={{ display: 'none' }}
            video={videos[1]}
          />
        </>
      )}
      <VideoFooter
        channel={channel}
        video={{ name: videos[currentVideoIndex]?.name }}
      />
    </ChannelRoomContainer>
  );
};

export default ChannelRoom;

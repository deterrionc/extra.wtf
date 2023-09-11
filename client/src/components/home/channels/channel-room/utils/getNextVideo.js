import videoList from "./videoList.json";

const getNextVideo = async (videoID, videoType) => {
  if (videoType === "music") {
    const videoIndex = videoList.music.findIndex((v) => v._id === videoID);
    if (videoIndex < videoList.music.length - 1) {
      return videoList.music[videoIndex + 1];
    } else {
      return videoList.music[0];
    }
  }

  if (videoType === "news") {
    if (videoID === 0) {
      return videoList.news[0];
    }
    const videoIndex = videoList.news.findIndex((v) => v._id === videoID);
    if (videoIndex < videoList.news.length - 1) {
      return videoList.news[videoIndex + 1];
    } else {
      return videoList.music[0];
    }
  }
};

export default getNextVideo;

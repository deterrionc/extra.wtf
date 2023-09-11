const getFirstVideo = async (channelSlug, serverMusics, serverNews) => {
  let currentTime = new Date();
  let currentMinute = currentTime.getMinutes();
  let currentHour = currentTime.getHours();

  let videos = [];
  let videoType = "music";

  if (currentHour >= 6 && currentHour <= 18) {
    // Day time
    if (currentMinute % 30 >= 5) {
      videos = serverMusics.find(music => music.slug === channelSlug).musics;
    } else {
      videos = serverNews.find(news => news.slug === channelSlug).news;
      videoType = "news";
    }
  } else {
    // Night Time
    if (currentMinute % 60 >= 5) {
      videos = serverMusics.find(music => music.slug === channelSlug).musics;
    } else {
      videos = serverNews.find(news => news.slug === channelSlug).news;
      videoType = "news";
    }
  }

  if (!videos || videos.length === 0) {
    return null
  }

  let video = {
    ...videos[0],
    type: videoType,
  };

  return video;
}

module.exports = getFirstVideo;

const getPlayList = (data) => {
  let news = [],
    music = [];

  // Check if data.music exists
  if (data.music) {
    // Extract music videos
    Object.entries(data.music).forEach(([categoryName, videos]) => {
      videos.forEach((video) => {
        music.push({ ...video, type: "music", category: categoryName });
      });
    });

    // Sort music videos by playedAt
    music.sort((a, b) => new Date(a.playedAt) - new Date(b.playedAt));
  }

  // Check if data.news exists
  if (data.news) {
    // Extract news videos with desired categories and quantities
    const categoriesOrder = [
      "jingle_nat",
      "news_nat",
      "jingle_int",
      "news_int",
    ];
    const categoriesQuantity = [1, 3, 1, 3]; // quantity of videos to select from each category

    categoriesOrder.forEach((category, index) => {
      let videos = data.news[category];

      // Check if videos array exists
      if (videos) {
        // Sort videos by playedAt
        videos.sort((a, b) => new Date(a.playedAt) - new Date(b.playedAt));

        // Select required quantity
        videos = videos.slice(0, categoriesQuantity[index]);

        // Add to news array with additional type and category properties
        videos.forEach((video) => {
          news.push({ ...video, type: "news", category: category });
        });
      }
    });
  }

  // Return combined list, with news coming after music
  return { music, news };
};

module.exports = getPlayList
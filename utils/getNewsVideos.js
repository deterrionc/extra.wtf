const config = require('config');
const fs = require("fs");
const path = require("path");
const dirPath = path.join(config.get('uploadDirectory'), "channels");

const getNextVideo = (files, playedAt, count) => {
  files.sort((a, b) => a.createdAt - b.createdAt);

  if (!playedAt || playedAt === "") {
    return files.slice(0, count);
  }

  const nextFiles = files.filter(file => new Date(file.createdAt).getTime() > new Date(playedAt).getTime());

  if (nextFiles.length < count) {
    return nextFiles.concat(files.slice(0, count - nextFiles.length));
  }

  return nextFiles.slice(0, count);
};

const getNewsVideos = async () => {
  const channelDirectories = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const news = [];

  for (const channelDir of channelDirectories) {
    const channelPath = path.join(dirPath, channelDir);
    const channelJSONPath = path.join(channelPath, 'channel.json');
    const playListJSONPath = path.join(channelPath, 'playList.json');

    if (fs.existsSync(channelJSONPath) && fs.existsSync(playListJSONPath)) {
      const channelData = JSON.parse(fs.readFileSync(channelJSONPath, 'utf-8'));
      const playListData = JSON.parse(fs.readFileSync(playListJSONPath, 'utf-8'));

      const newsOrder = [
        { category: 'jingle_nat', count: 1 },
        { category: 'news_nat', count: 3 },
        { category: 'jingle_int', count: 1 },
        { category: 'news_int', count: 3 },
        { category: 'next_news_30', count: 3 },
        { category: 'next_news_60', count: 3 }
      ];

      let newsFiles = [];

      for (const { category, count } of newsOrder) {
        const categoryPath = path.join(channelPath, category);
        
        if (fs.existsSync(categoryPath)) {
          const files = fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.mp4'))
            .map(file => {
              const filePath = path.join(categoryPath, file);
              const stats = fs.statSync(filePath);
              return {
                name: file,
                path: path.join("upload/channels", channelDir, category, file),
                createdAt: new Date(stats.birthtime).getTime(),
              };
            });

          const nextVideos = getNextVideo(files, playListData[category]?.playedAt || "", count);
          if (nextVideos.length > 0) {
            newsFiles = newsFiles.concat(nextVideos);
          }
        }
      }

      news.push({
        slug: channelData.slug,
        news: newsFiles,
      });
    }
  }

  return news;
};

module.exports = getNewsVideos;

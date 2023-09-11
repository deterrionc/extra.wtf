const config = require('config');
const fs = require("fs");
const path = require("path");
const dirPath = path.join(config.get('uploadDirectory'), "channels");

const getSortedMusicFiles = (files, lastPlayedFile) => {
  files.sort((a, b) => a.createdAt - b.createdAt);

  if (!lastPlayedFile) {
    return files;
  }

  const index = files.findIndex(file => file.name === lastPlayedFile);
  
  if (index === -1) {
    return files;
  }

  // Rotate the array so that it starts from the file after the last played one
  return [...files.slice(index + 1), ...files.slice(0, index + 1)];
};

const getMusicVideos = async () => {
  const channelDirectories = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const musics = [];

  for (const channelDir of channelDirectories) {
    const channelPath = path.join(dirPath, channelDir);
    const channelJSONPath = path.join(channelPath, 'channel.json');
    const playListJSONPath = path.join(channelPath, 'playList.json');

    if (fs.existsSync(channelJSONPath) && fs.existsSync(playListJSONPath)) {
      const channelData = JSON.parse(fs.readFileSync(channelJSONPath, 'utf-8'));
      const playListData = JSON.parse(fs.readFileSync(playListJSONPath, 'utf-8'));
      const musicPath = path.join(channelPath, 'music');

      if (fs.existsSync(musicPath)) {
        let musicFiles = fs.readdirSync(musicPath)
          .filter(file => file.endsWith('.mp4'))
          .map(file => {
            const filePath = path.join(musicPath, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              path: path.join("upload/channels", channelDir, 'music', file),
              createdAt: new Date(stats.birthtime).getTime(),
              category: "music"
            };
          });

        const sortedMusicFiles = getSortedMusicFiles(musicFiles, playListData['music']?.video);

        musics.push({
          slug: channelData.slug,
          musics: sortedMusicFiles,
        });
      }
    }
  }

  return musics;
};

module.exports = getMusicVideos;

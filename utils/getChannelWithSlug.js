const config = require('config')
const fs = require("fs");
const path = require("path");
const dirPath = path.join(config.get('uploadDirectory'), "channels")

const getChannelWithSlug = async (slug) => {
  let channelDirs = fs.readdirSync(dirPath)

  let channel = {}

  channelDirs.forEach((dir) => {
    let channelPath = path.join(dirPath, dir, 'channel.json')
    if (fs.existsSync(channelPath)) {
      let channelData = fs.readFileSync(channelPath, 'utf8')
      let _channel = JSON.parse(channelData)
      if (_channel.slug === slug) {
        channel = _channel
        channel.path = dir

        let subDirs = fs.readdirSync(path.join(dirPath, dir));
        subDirs.forEach((subDir) => {
          let videoDir = path.join(dirPath, dir, subDir);
          if (fs.statSync(videoDir).isDirectory()) {
            let videoFiles = fs.readdirSync(videoDir).filter(file => file.endsWith('.mp4'));
            channel[subDir] = videoFiles;
          }
        });
      }
    }
  })

  return channel
}

module.exports = getChannelWithSlug;

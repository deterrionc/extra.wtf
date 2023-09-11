import videoList from './videoList.json'

const getFirstVideo = async () => {
  return videoList.music[0]
}

export default getFirstVideo
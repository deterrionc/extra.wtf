import { Routes, Route } from 'react-router-dom'
import VideoChannels from './_default'
import ChannelRoom from './channel-room'

const AntalVideosChannelContainer = () => {
  return (
    <Routes>
      <Route path='/' element={<VideoChannels />} />
      <Route path='/:id' element={<ChannelRoom />} />
    </Routes>
  )
}

export default AntalVideosChannelContainer
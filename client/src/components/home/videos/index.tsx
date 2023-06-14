import { Routes, Route } from 'react-router-dom'
import Videos from './_default'
import VideoRoom from './video-room'

const VideoContainer = () => {
  return (
    <Routes>
      <Route path='/' element={<Videos />} />
      <Route path='/:id' element={<VideoRoom />} />
    </Routes>
  )
}

export default VideoContainer
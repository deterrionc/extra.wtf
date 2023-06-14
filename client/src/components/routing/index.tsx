import { Routes, Route, Navigate } from 'react-router-dom'

// components import
import HomeContainer from '../home'
import Dashboard from '../dashboard'
// import Videos from '../home/videos'
// import Articles from '../home/articles'
// import VideoRoom from '../home/videos/video-room'

const Routing = () => {
  return (
    <Routes>
      <Route path='/*' element={<HomeContainer />} />
      {/* <Route exact path='/videos' element={<Videos />} />
      <Route exact path='/videos/:id' element={<VideoRoom />} />
      <Route exact path='/articles' element={<Articles />} /> */}
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default Routing
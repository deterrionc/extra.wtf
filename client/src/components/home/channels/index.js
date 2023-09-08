import { Routes, Route } from 'react-router-dom'
import Channels from './_default'
import ChannelRoom from './channel-room'

const ChannelContainer = () => {
  return (
    <Routes>
      <Route path='/' element={<Channels />} />
      <Route path='/:slug' element={<ChannelRoom />} />
    </Routes>
  )
}

export default ChannelContainer
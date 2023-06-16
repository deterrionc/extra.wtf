import { Routes, Route, Navigate } from 'react-router-dom'

// components import
import HomeContainer from '../home'
import Dashboard from '../dashboard'
import AuthContainer from '../auth'

const Routing = () => {
  return (
    <Routes>
      <Route path='/*' element={<HomeContainer />} />
      <Route path='/auth/*' element={<AuthContainer />} />
      <Route path='/dashboard/*' element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default Routing
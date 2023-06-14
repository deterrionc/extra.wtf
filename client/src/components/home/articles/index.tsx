import { Routes, Route } from 'react-router-dom'
import Articles from './_default'

const ArticleContainer = () => {
  return (
    <Routes>
      <Route path='/' element={<Articles />} />
    </Routes>
  )
}

export default ArticleContainer
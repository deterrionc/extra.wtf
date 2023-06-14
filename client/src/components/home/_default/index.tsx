import React from 'react'
import tempData from '../../../utils/temp.json'
import VideoCardList from '../../../container/organisms/VideoCardList'
import ArticleCardList from '../../../container/organisms/ArticleCardList'

const topArticles = tempData.articles
const topVideos = tempData.videos

const Home = () => {
  return (
    <React.Fragment>
      <VideoCardList videos={topVideos} />
      <ArticleCardList articles={topArticles} />
    </React.Fragment>
  )
}

export default Home
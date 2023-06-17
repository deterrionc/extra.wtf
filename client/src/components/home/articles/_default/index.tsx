import React from 'react'
import { Link } from 'react-router-dom'
import { FaIcon } from '../../../../container/atoms/FaIcon'
import tempData from '../../../../utils/temp.json'
import Article from "../../../../container/molecules/ArticleCard"
const topArticles = tempData.articles

const Articles = () => {
  return (
    <React.Fragment>
      <div className="py-3">
        <Link to='/articles'>
          <h5 className="m-1 pb-3 text-lg font-bold leading-6">Articles <FaIcon iconName="fa-arrow-right" /></h5>
        </Link>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {topArticles.length && topArticles.map((article, index) =>
            <Article key={index} article={article} />
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Articles
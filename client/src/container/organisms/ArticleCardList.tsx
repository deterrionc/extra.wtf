import { useState, useEffect } from "react"
import Article from "../molecules/ArticleCard"
import { FaIcon } from "../atoms/FaIcon"
import { Link } from "react-router-dom"

interface ArticleCardListProps {
  articles: any
}

const ArticleCardList = ({ articles }: ArticleCardListProps) => {
  const [_articles, setArticles] = useState([])

  useEffect(() => {
    setArticles(articles)
  }, [articles])

  return (
    <div className="py-3">
      <Link to='/articles'>
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">Articles <FaIcon iconName="fa-arrow-right" /></h5>
      </Link>
      <div className="grid grid-cols-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {_articles.length && _articles.map((article, index) =>
          <Article key={index} article={article} />
        )}
      </div>
    </div>
  )
}

export default ArticleCardList
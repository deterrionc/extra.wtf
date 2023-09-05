interface ArticleProps {
  article: {
    topic: string,
    title: string,
    description: string
    image: string,
    path: string,
  }
}

const ArticleCard = ({ article }: ArticleProps) => {
  return (
    <div className="m-1 width-calc bg-article-card rounded overflow-hidden">
      <img alt={article.topic} src={`/${article.path}/${article.image}`} className="w-full aspect-[3/2]" />
      <div className="p-2">
        <div className="text-base">{article.topic}</div>
        <h4 className="text-xl font-bold leading-6">{article.title}</h4>
        <div className="text-xs pt-2">{article.description}</div>
      </div>
    </div>
  )
}

export default ArticleCard
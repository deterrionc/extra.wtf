import { Link } from "react-router-dom";

interface ArticleProps {
  article: {
    topic: string;
    title: string;
    description: string;
    image: string;
    path: string;
    link: string;
  };
}

const ArticleCard = ({ article }: ArticleProps) => {
  return (
    <Link to={article.link} target="_blank">
      <div className="m-1 width-calc bg-article-card rounded overflow-hidden cursor-pointer">
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <img
            alt={article.topic}
            src={`/${article.path}/${article.image}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-2">
          <div className="text-base">{article.topic}</div>
          <h4 className="text-xl font-bold leading-6">{article.title}</h4>
          <div className="text-xs pt-2">{article.description}</div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;

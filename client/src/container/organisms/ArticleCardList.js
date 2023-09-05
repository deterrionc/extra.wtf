import { useState, useEffect } from "react";
import Article from "../molecules/ArticleCard";
import { FaIcon } from "../atoms/FaIcon";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const ArticleCardList = ({ articles }) => {
  const [_articles, setArticles] = useState([]);

  useEffect(() => {
    setArticles(articles);
  }, [articles]);

  const settings = {
    dots: true,
    infinite: _articles.length > 6,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  useEffect(() => {
    // After the component mounts, get the list of all cards
    const cards = Array.from(document.querySelectorAll('.m-1.width-calc.bg-article-card.rounded.overflow-hidden'));
    let maxHeight = 0;
  
    // Reset each card height to auto before calculating the natural height
    cards.forEach(card => {
      card.style.height = 'auto';
    });
  
    // Find the maximum height among all cards
    cards.forEach(card => {
      if (card.offsetHeight > maxHeight) {
        maxHeight = card.offsetHeight;
      }
    });
  
    // Set each card height to the maximum height
    cards.forEach(card => {
      card.style.height = `${maxHeight}px`;
    });
  }, [_articles]); // Run this whenever the _articles state changes
  

  return (
    <div className="py-3">
      <Link to="/articles">
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">
          Articles <FaIcon iconName="fa-arrow-right" />
        </h5>
      </Link>
      <Slider {...settings}>
        {_articles.length &&
          _articles.map((article, index) => (
            <div key={index}>
              <Article article={article} />
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default ArticleCardList;

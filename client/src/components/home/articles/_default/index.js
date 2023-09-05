import {useEffect, Fragment} from 'react'
import { Link } from 'react-router-dom'
import { FaIcon } from '../../../../container/atoms/FaIcon'
import Article from "../../../../container/molecules/ArticleCard"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getArticles } from "../../../../actions/article";

const Articles = ({ getArticles, articles }) => {
  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <Fragment>
      <div className="py-3">
        <Link to='/articles'>
          <h5 className="m-1 pb-3 text-lg font-bold leading-6">Articles <FaIcon iconName="fa-arrow-right" /></h5>
        </Link>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {articles.length && articles.map((article, index) =>
            <Article key={index} article={article} />
          )}
        </div>
      </div>
    </Fragment>
  )
}

Articles.propTypes = {
  getArticles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  articles: state.article.articles,
});

export default connect(mapStateToProps, { getArticles })(
  Articles
);

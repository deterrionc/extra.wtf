import {useEffect, Fragment} from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getArticles } from "../../../../actions/article";
import ArticleCardList from '../../../../container/organisms/ArticleCardList';

const Articles = ({ getArticles, articles }) => {
  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <ArticleCardList articles={articles} />
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

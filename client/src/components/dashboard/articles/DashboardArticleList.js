import { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getArticles, deleteArticle } from "../../../actions/article";
import { FaIcon } from "../../../container/atoms/FaIcon";

const DashboardArticleList = ({ getArticles, deleteArticle, articles }) => {
  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <div className="p-3 bg-gray-100 rounded-lg flex flex-col">
      <h2 className="text-xl font-medium mb-4">Article List</h2>

      <div className="flex items-center justify-end mb-4">
        <Link
          to="/dashboard/articles/create"
          className="py-2 px-3 rounded bg-lime-900 text-white"
        >
          Create An Article
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Topic</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Path</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {articles.map((article, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left">{article.topic}</td>
                <td className="py-3 px-6 text-left">{article.title}</td>
                <td className="py-3 px-6 text-left">{article.path}</td>
                <td className="py-3 px-6 text-center">
                  <img
                    src={`/${article.image}`}
                    alt="ArticleImage"
                    className="rounded-md w-32 mx-auto"
                  />
                </td>
                <td className="py-3 px-6 text-left">
                  <Link
                    to={`/dashboard/articles/edit/${article._id}`}
                    className="py-2 px-3 rounded bg-teal-800 text-white mx-1"
                  >
                    <FaIcon iconName="fa fa-edit" />
                  </Link>
                  <button
                    className="py-2 px-3 rounded bg-orange-700 text-white mx-1"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this article?"
                        )
                      ) {
                        deleteArticle(article._id);
                      }
                    }}
                  >
                    <FaIcon iconName="fa fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DashboardArticleList.propTypes = {
  getArticles: PropTypes.func.isRequired,
  deleteArticle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  articles: state.article.articles,
});

export default connect(mapStateToProps, { getArticles, deleteArticle })(
  DashboardArticleList
);

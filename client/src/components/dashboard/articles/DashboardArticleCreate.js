import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Replace with your actual action
import { createArticle } from '../../../actions/article';

const DashboardArticleCreate = ({ createArticle }) => {
  let navigate = useNavigate();
  const [articleImage, setArticleImage] = useState(null);
  const [articleTopic, setArticleTopic] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [articleLink, setArticleLink] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append('image', articleImage);
    formData.append('topic', articleTopic);
    formData.append('title', articleTitle);
    formData.append('description', articleDescription);
    formData.append('link', articleLink);

    createArticle(formData, navigate);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Create an Article</h2>
      
      <div className="mb-4">
        <label
          htmlFor="articleTopic"
          className="block text-gray-700 font-medium mb-2"
        >
          Article Topic:
        </label>
        <input
          type="text"
          id="articleTopic"
          value={articleTopic}
          onChange={(e) => setArticleTopic(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="articleTitle"
          className="block text-gray-700 font-medium mb-2"
        >
          Article Title:
        </label>
        <input
          type="text"
          id="articleTitle"
          value={articleTitle}
          onChange={(e) => setArticleTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="articleDescription"
          className="block text-gray-700 font-medium mb-2"
        >
          Article Description:
        </label>
        <textarea
          id="articleDescription"
          value={articleDescription}
          onChange={(e) => setArticleDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>

      <div className="mb-4">
        <label
          htmlFor="articleLink"
          className="block text-gray-700 font-medium mb-2"
        >
          Article Link:
        </label>
        <input
          type="text"
          id="articleLink"
          value={articleLink}
          onChange={(e) => setArticleLink(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="articleImage"
          className="block text-gray-700 font-medium mb-2"
        >
          Article Image:
        </label>
        <input
          type="file"
          accept="image/*"
          id="articleImage"
          onChange={(event) => setArticleImage(event.target.files[0])}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {articleImage && (
          <img
            src={URL.createObjectURL(articleImage)}
            alt="SETIMAGE"
            className="mt-2 w-32"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-teal-800 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Publish
      </button>
    </form>
  );
};

DashboardArticleCreate.propTypes = {
  createArticle: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createArticle })(DashboardArticleCreate);

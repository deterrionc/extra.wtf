import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../../actions/category';

const CreateCategory = ({ createCategory }) => {
  let navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('music');

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = { name, type };
    createCategory(formData, navigate);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Create a Category</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Category Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
          Category Type:
        </label>
        <select
          id="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="news">News</option>
          <option value="music">Music</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="type" className="block text-orange-700 font-small mb-2">
          Category is used to save the videos and also it indicates the
          directory path. For example, if category name is set 'National' and
          type is 'News', the directory is set '/files/news/national'
        </label>
      </div>

      <button
        type="submit"
        className="bg-teal-800 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Create
      </button>
    </form>
  );
};

CreateCategory.propTypes = {
  createCategory: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createCategory })(CreateCategory);

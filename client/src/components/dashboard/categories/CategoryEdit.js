import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateCategory, getCategory, updateChannelCategory } from '../../../actions/category';
import { useParams } from 'react-router-dom';

const CategoryEdit = ({ updateCategory, updateChannelCategory, getCategory, category }) => {
  const params = useParams();
  const categoryID = params.id;
  let navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('music');

  useEffect(() => {
    getCategory(categoryID);
  }, [getCategory, categoryID]);

  useEffect(() => {
    category?._id && setName(category.name);
    category?._id && setType(category.type);
  }, [category]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name === category.name && type === category.type) {
      alert('There is no change.');
      return;
    }
    let formData = { name, type };
    // updateCategory(categoryID, formData, navigate);
    updateChannelCategory(categoryID, formData, navigate, category.channelID);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Edit a Category</h2>

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
        Update
      </button>
    </form>
  );
};

const mapStateToProps = (state) => ({
  category: state.category.category
});

export default connect(mapStateToProps, { updateCategory, getCategory, updateChannelCategory })(
  CategoryEdit
);

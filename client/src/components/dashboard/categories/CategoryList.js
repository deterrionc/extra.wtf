import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCategories, deleteCategory } from '../../../actions/category';
import { FaIcon } from '../../../container/atoms/FaIcon';

const CategoryList = ({ getCategories, deleteCategory, categories }) => {
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className="p-3 bg-gray-100 rounded-lg flex flex-col">
      <h2 className="text-xl font-medium mb-4">Category List</h2>

      <div className="flex items-center justify-end mb-4">
        <Link
          to="/dashboard/categories/create"
          className="py-2 px-3 rounded bg-lime-900 text-white"
        >
          Create A Category
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full min-w-max md:table">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal md:table-row">
              <th className="py-3 px-6 text-left md:table-cell">No</th>
              <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                Type
              </th>
              <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                Name
              </th>
              <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                Path
              </th>
              <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                Videos
              </th>
              <th className="py-3 px-6 text-left md:table-cell">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light md:table-row-group">
            {categories.map((category, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100 md:table-row"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap md:table-cell">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  {category.type}
                </td>
                <td className="py-3 px-6 text-left font-medium md:table-cell max-w-xs overflow-x-auto">
                  {category.name}
                </td>
                <td className="py-3 px-6 text-left md:table-cell">
                  {category.path}
                </td>
                <td className="py-3 px-6 text-left md:table-cell">
                  {category.videos.length}
                </td>
                <td className="py-3 px-6 text-left md:table-cell">
                  <Link
                    to={`/dashboard/categories/videos/${category._id}`}
                    className="py-2 px-3 rounded bg-blue-800 text-white mx-1"
                  >
                    <FaIcon iconName="fa fa-file-video-o" />
                  </Link>
                  <Link
                    to={`/dashboard/categories/edit/${category._id}`}
                    className="py-2 px-3 rounded bg-teal-800 text-white mx-1"
                  >
                    <FaIcon iconName="fa fa-edit" />
                  </Link>
                  <button
                    className="py-2 px-3 rounded bg-orange-700 text-white mx-1"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this category? If you delete this category, the files in the directory are permanently deleted.'
                        )
                      )
                        deleteCategory(category._id);
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

CategoryList.propTypes = {
  getCategories: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  categories: state.category.categories
});

export default connect(mapStateToProps, { getCategories, deleteCategory })(
  CategoryList
);

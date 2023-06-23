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
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Path</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {categories.map((category, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left">{category.type}</td>
                <td className="py-3 px-6 text-left font-medium">
                  {category.name}
                </td>
                <td className="py-3 px-6 text-left">{category.path}</td>
                <td className="py-3 px-6 text-left">
                  <Link
                    to={`/dashboard/categories/edit/${category._id}`}
                    className="py-2 px-3 rounded bg-blue-500 text-white mx-1"
                  >
                    <FaIcon iconName="fa fa-edit" />
                  </Link>
                  <button
                    className="py-2 px-3 rounded bg-red-500 text-white mx-1"
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

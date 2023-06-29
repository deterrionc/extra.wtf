import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCategory, addVideoToCategory } from '../../../actions/category';
import { Link, useParams } from 'react-router-dom';
import { getFiles } from '../../../actions/file';
import Spinner from '../../../container/organisms/Spinner';

const CategoryVideos = ({
  files,
  getFiles,
  getCategory,
  category,
  addVideoToCategory,
  isLoading
}) => {
  const params = useParams();
  const categoryID = params.id;

  useEffect(() => {
    getFiles();
    getCategory(categoryID);
  }, [getFiles, getCategory, categoryID]);

  return (
    <div className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Category Videos</h2>

      <div className="mb-2 flex">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Category Name:
        </label>
        <p className="pl-3">{category.name}</p>
      </div>

      <div className="mb-4 flex">
        <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
          Category Type:
        </label>
        <p className="pl-3">{category.type}</p>
      </div>

      <div className="flex items-center justify-end mb-4">
        <Link
          to={`/dashboard/categories/upload/${categoryID}`}
          className="py-2 px-3 rounded bg-lime-900 text-white"
        >
          Upload Videos
        </Link>
      </div>

      {isLoading && <Spinner />}
      {!isLoading && (
        <div className="overflow-x-auto md:overflow-visible">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Category Videos:
          </label>
          <table className="table-auto w-full md:table mb-8">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal md:table-row">
                <th className="py-3 px-6 text-left md:table-cell">No</th>
                <th className="py-3 px-6 text-left max-w-xs overflow-x-auto md:table-cell">
                  Name
                </th>
                <th className="py-3 px-6 text-left max-w-xs overflow-x-auto md:table-cell">
                  Path
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light md:table-row-group">
              {category.videos &&
                category.videos.map((file, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100 md:table-row"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap md:table-cell">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 text-left font-medium md:table-cell max-w-xs overflow-x-auto">
                      {file.name}
                    </td>
                    <td className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                      {file.path}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {files.length > 0 && (
            <>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Outer Videos:
              </label>
              <table className="table-auto w-full md:table">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal md:table-row">
                    <th className="py-3 px-6 text-left md:table-cell">No</th>
                    <th className="py-3 px-6 text-left max-w-xs overflow-x-auto md:table-cell">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left max-w-xs overflow-x-auto md:table-cell">
                      Path
                    </th>
                    <th className="py-3 px-6 text-left md:table-cell">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light md:table-row-group">
                  {files.map((file, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100 md:table-row"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap md:table-cell">
                        {index + 1}
                      </td>
                      <td className="py-3 px-6 text-left font-medium md:table-cell max-w-xs overflow-x-auto">
                        {file.name}
                      </td>
                      <td className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                        {file.path}
                      </td>
                      <td className="py-3 px-6 text-left md:table-cell">
                        <button
                          className="py-2 px-3 rounded bg-teal-700 text-white mx-1"
                          onClick={() => {
                            addVideoToCategory(categoryID, file);
                          }}
                        >
                          Move to this Category
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

CategoryVideos.propTypes = {
  getFiles: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  getCategory: PropTypes.func.isRequired,
  addVideoToCategory: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  files: state.file.files,
  category: state.category.category,
  isLoading: state.spinner.isLoading
});

export default connect(mapStateToProps, {
  getFiles,
  getCategory,
  addVideoToCategory
})(CategoryVideos);

import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { uploadVideoToCategory } from '../../../actions/category';
import { useParams } from 'react-router-dom';

const CategoryVideoUpload = ({ uploadVideoToCategory }) => {
  const params = useParams();
  const categoryID = params.id;
  let navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let i = 0; i < videos.length; i++) {
      let formData = new FormData();
      formData.append('video', videos[i]);
      let process = await uploadVideoToCategory(categoryID, formData)
      if (process === true) {
        setUploadProgress(prevProgress => prevProgress + (100 / videos.length)); // updating the progress here
      } else {
        return
      }
    }

    navigate(`/dashboard/categories/videos/${categoryID}`)
  };

  const handleVideoChange = (event) => {
    let files = Array.from(event.target.files);
    setVideos(files);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Upload Videos</h2>

      {uploadProgress > 0 && (
        <div className="h-2 bg-gray-200 mb-4 rounded">
          <div
            className="h-full bg-blue-500 rounded"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="videos"
          className="block text-gray-700 font-medium mb-2"
        >
          Videos:
        </label>
        <input
          type="file"
          accept="video/*"
          multiple
          id="videos"
          onChange={handleVideoChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />

        <div className="w-full flex flex-wrap">
          {videos.map((video, index) => (
            <video
              key={index}
              src={URL.createObjectURL(video)}
              alt="Uploaded video"
              className="mt-2 w-32 mr-2"
              controls
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-teal-800 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Upload
      </button>
    </form>
  );
};

CategoryVideoUpload.propTypes = {
  uploadVideoToCategory: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { uploadVideoToCategory })(CategoryVideoUpload);

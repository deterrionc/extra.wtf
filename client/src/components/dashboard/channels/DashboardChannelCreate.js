import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { createChannel } from '../../../actions/channel';

const DashboardChannelCreate = ({ createChannel }) => {
  let navigate = useNavigate();
  const [channelName, setChannelName] = useState('');
  const [channelImage, setChannelImage] = useState(null);
  const [videos, setVideos] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append('name', channelName);
    formData.append('image', channelImage);

    for (let i = 0; i < videos.length; i++) {
      formData.append('videos', videos[i]);
    }

    createChannel(formData, navigate);
  };

  const handleVideoChange = (event) => {
    let files = Array.from(event.target.files);
    setVideos(files);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Create a Video Channel</h2>

      <div className="mb-4">
        <label
          htmlFor="channelName"
          className="block text-gray-700 font-medium mb-2"
        >
          Channel Name:
        </label>
        <input
          type="text"
          id="channelName"
          value={channelName}
          onChange={(event) => setChannelName(event.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="channelImage"
          className="block text-gray-700 font-medium mb-2"
        >
          Channel Image:
        </label>
        <input
          type="file"
          accept="image/*"
          id="channelImage"
          onChange={(event) => setChannelImage(event.target.files[0])}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {channelImage && (
          <img
            src={URL.createObjectURL(channelImage)}
            alt="Uploadedimage"
            className="mt-2 w-32"
          />
        )}
      </div>

      <div className="mb-4 flex flex-wrap">
        <label
          htmlFor="videos"
          className="block text-gray-700 font-medium mb-2 w-full"
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
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Upload
      </button>
    </form>
  );
};

DashboardChannelCreate.propTypes = {
  createChannel: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createChannel })(
  DashboardChannelCreate
);

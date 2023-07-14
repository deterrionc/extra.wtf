import { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { updateChannel, getChannel } from "../../../actions/channel";

const DashboardChannelEdit = ({ updateChannel, getChannel, channel }) => {
  const params = useParams();
  const channelID = params.id;
  let navigate = useNavigate();
  const [channelName, setChannelName] = useState("");
  const [channelImage, setChannelImage] = useState(null);
  const [channelSlug, setChannelSlug] = useState('');
  const [channelFolder, setChannelFolder] = useState('');

  useEffect(() => {
    getChannel(channelID)
  }, [channelID, getChannel])

  useEffect(() => {
    setChannelName(channel?.name)
    setChannelSlug(channel?.slug)
    setChannelFolder(channel?.folder)
  }, [channel])

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("name", channelName);
    formData.append("slug", channelSlug);
    formData.append("image", channelImage);

    updateChannel(channelID, formData, navigate);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Update Video Channel</h2>

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
          onChange={(event) => {
            setChannelName(event.target.value)
            setChannelSlug(convertToSlug(event.target.value))
          }}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="channelName"
          className="block text-gray-700 font-medium mb-2"
        >
          Channel Slug:
        </label>
        <input
          type="text"
          id="channelSlug"
          value={channelSlug}
          onChange={(event) => setChannelSlug(event.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="channelName"
          className="block text-gray-700 font-medium mb-2"
        >
          Channel Folder:
        </label>
        <input
          type="text"
          id="channelFolder"
          value={channelFolder}
          disabled
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

      <button
        type="submit"
        className="bg-teal-800 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Upload
      </button>
    </form>
  );
};

const convertToSlug = (str) => {
  let slug = str.replace("-", " ");
  // Remove special characters, replace spaces with underscores
  slug = slug
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();

  // Remove leading numbers followed by an underscore
  slug = slug.replace(/^\d+_/, "");

  // Replace hyphens with underscores
  slug = slug.replace(/-/g, "_");

  return slug;
};


DashboardChannelEdit.propTypes = {
  updateChannel: PropTypes.func.isRequired,
  getChannel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  channel: state.channel.channel
});

export default connect(mapStateToProps, { updateChannel, getChannel })(
  DashboardChannelEdit
);

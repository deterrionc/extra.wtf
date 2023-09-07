import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSvideo,
  updateSvideo,
  updateSvideoWithImage,
  updateSvideoWithVideo,
  updateSvideoWithImageVideo,
} from "../../../actions/svideo";

const DashboardSvideoEdit = ({
  svideo,
  getSvideo,
  updateSvideo,
  updateSvideoWithImage,
  updateSvideoWithVideo,
  updateSvideoWithImageVideo,
}) => {
  const params = useParams();
  const svideoId = params.id;
  let navigate = useNavigate();
  const [svideoImage, setSvideoImage] = useState(null);
  const [svideoFile, setSvideoFile] = useState(null);
  const [svideoTitle, setSvideoTitle] = useState("");
  const [showImagePath, setShowImagePath] = useState(null);
  const [showFilePath, setShowFilePath] = useState(null);

  useEffect(() => {
    getSvideo(svideoId);
  }, [getSvideo, svideoId]);

  useEffect(() => {
    setSvideoTitle(svideo.title);
    setShowImagePath(svideo.image);
    setShowFilePath(svideo.video);
  }, [svideo]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (svideoImage && svideoFile) {
      let formData = new FormData();
      formData.append("image", svideoImage);
      formData.append("video", svideoFile);
      formData.append("title", svideoTitle);
      updateSvideoWithImageVideo(formData, navigate, svideoId);
    } else if (svideoImage) {
      let formData = new FormData();
      formData.append("image", svideoImage);
      formData.append("title", svideoTitle);
      updateSvideoWithImage(formData, navigate, svideoId);
    } else if (svideoFile) {
      let formData = new FormData();
      formData.append("video", svideoFile);
      formData.append("title", svideoTitle);
      updateSvideoWithVideo(formData, navigate, svideoId);
    } else {
      let formData = {
        title: svideoTitle,
      };
      updateSvideo(formData, navigate, svideoId);
    }
  };

  const handleImageChange = (image) => {
    setSvideoImage(image);
    setShowImagePath(null);
  };

  const handleFileChange = (file) => {
    setSvideoFile(file);
    setShowFilePath(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Edit a Video</h2>

      <div className="mb-4">
        <label
          htmlFor="svideoTitle"
          className="block text-gray-700 font-medium mb-2"
        >
          Video Title:
        </label>
        <input
          type="text"
          id="svideoTitle"
          value={svideoTitle}
          onChange={(e) => setSvideoTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="svideoImage"
          className="block text-gray-700 font-medium mb-2"
        >
          Video Image:
        </label>
        <input
          type="file"
          accept="image/*"
          id="svideoImage"
          onChange={(event) => handleImageChange(event.target.files[0])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {showImagePath && (
          <img
            src={`/${svideo.path}/${showImagePath}`}
            alt="SETIMAGE"
            className="mt-2 w-32"
          />
        )}
        {svideoImage && (
          <img
            src={URL.createObjectURL(svideoImage)}
            alt="SETIMAGE"
            className="mt-2 w-32"
          />
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="svideoImage"
          className="block text-gray-700 font-medium mb-2"
        >
          Video File:
        </label>
        <input
          type="file"
          accept="video/*"
          id="svideoFile"
          onChange={(event) => handleFileChange(event.target.files[0])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {showFilePath && (
          <video
            src={`/${svideo.path}/${showFilePath}`}
            alt="Uploaded video"
            className="mt-2 w-32 mr-2"
            controls
          />
        )}
        {svideoFile && (
          <video
            src={URL.createObjectURL(svideoFile)}
            alt="Uploaded video"
            className="mt-2 w-32 mr-2"
            controls
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

const mapStateToProps = (state) => ({
  svideo: state.svideo.svideo,
});

export default connect(mapStateToProps, {
  getSvideo,
  updateSvideo,
  updateSvideoWithImage,
  updateSvideoWithVideo,
  updateSvideoWithImageVideo,
})(DashboardSvideoEdit);

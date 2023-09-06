import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
// Replace with your actual action
import { createSvideo } from "../../../actions/svideo";

const DashboardSvideoCreate = ({ createSvideo }) => {
  let navigate = useNavigate();
  const [svideoImage, setSvideoImage] = useState(null);
  const [svideoFile, setSvideoFile] = useState(null);
  const [svideoTitle, setSvideoTitle] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("image", svideoImage);
    formData.append("video", svideoFile);
    formData.append("title", svideoTitle);

    createSvideo(formData, navigate);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-medium mb-4">Create an Svideo</h2>

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
          onChange={(event) => setSvideoImage(event.target.files[0])}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
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
          htmlFor="svideoFile"
          className="block text-gray-700 font-medium mb-2"
        >
          Video File:
        </label>
        <input
          type="file"
          accept="video/*"
          id="svideoFile"
          onChange={(event) => setSvideoFile(event.target.files[0])}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
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

DashboardSvideoCreate.propTypes = {
  createSvideo: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { createSvideo })(
  DashboardSvideoCreate
);

import React from 'react';
import { connect } from 'react-redux';
import {
  getLastPlayedVideos,
  getChannelVideos
} from '../../../actions/channel';

const Dashboard = ({
  getChannelVideos,
  getLastPlayedVideos,
  logs,
  videos
}) => {
  React.useEffect(() => {
    getLastPlayedVideos();
    getChannelVideos();
  }, [getLastPlayedVideos, getChannelVideos]);

  return (
    <React.Fragment>
      <div className="flex-grow bg-gray-100 p-3">
        <h2 className="text-xl font-medium mb-4">Playlist</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-max md:table">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal md:table-row">
                <th className="py-3 px-6 text-left md:table-cell">No</th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  Video Name
                </th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  Path
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light md:table-row-group">
              {videos.map((video, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-6 text-left">{video.name}</td>
                  <td className="py-3 px-6 text-left">{video.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <h2 className="text-xl font-medium mb-4">Last Played 10 Videos</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-max md:table">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal md:table-row">
                <th className="py-3 px-6 text-left md:table-cell">No</th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  Video Name
                </th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  Category
                </th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  Time
                </th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  IP Address
                </th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  Browser
                </th>
                <th className="py-3 px-6 text-left md:table-cell max-w-xs overflow-x-auto">
                  OS
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light md:table-row-group">
              {logs.map((video, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-6 text-left">{video.video}</td>
                  <td className="py-3 px-6 text-left">{video.category}</td>
                  <td className="py-3 px-6 text-left">
                    {video.date.slice(0, 19)}
                  </td>
                  <td className="py-3 px-6 text-left">{video.ip}</td>
                  <td className="py-3 px-6 text-left">{video.browser}</td>
                  <td className="py-3 px-6 text-left">{video.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  logs: state.channel.logs,
  videos: state.video.videos
});

export default connect(mapStateToProps, {
  getLastPlayedVideos,
  getChannelVideos
})(Dashboard);

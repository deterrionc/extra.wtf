import React from 'react';
import { connect } from 'react-redux';
import {
  getLogs,
  getAdminLogs,
  getChannelVideos
} from '../../../actions/channel';

const Dashboard = ({
  getChannelVideos,
  getLogs,
  getAdminLogs,
  logs,
  adminLogs,
  videos
}) => {
  const [showLogType, setShowLogType] = React.useState('all')

  React.useEffect(() => {
    getLogs();
    getAdminLogs();
    getChannelVideos();
  }, [getLogs, getChannelVideos, getAdminLogs]);

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
        <div className="flex items-center justify-end mb-4">
          {showLogType === 'all' ?
            <button
              className="py-2 px-3 rounded bg-teal-900 text-white"
              onClick={() => setShowLogType('admin')}
            >
              Show Mine
            </button>
            :
            <button
              onClick={() => setShowLogType('all')}
              className="py-2 px-3 rounded bg-lime-900 text-white"
            >
              Show All
            </button>
          }
        </div>
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
            {showLogType === 'all' ?
              <tbody className="text-gray-600 text-sm font-light md:table-row-group">
                {logs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 text-left">{log.video}</td>
                    <td className="py-3 px-6 text-left">{log.category}</td>
                    <td className="py-3 px-6 text-left">
                      {log.date.slice(0, 19)}
                    </td>
                    <td className="py-3 px-6 text-left">{log.ip}</td>
                    <td className="py-3 px-6 text-left">{log.browser}</td>
                    <td className="py-3 px-6 text-left">{log.os}</td>
                  </tr>
                ))}
              </tbody>
              :
              <tbody className="text-gray-600 text-sm font-light md:table-row-group">
                {adminLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3 px-6 text-left">{log.video}</td>
                    <td className="py-3 px-6 text-left">{log.category}</td>
                    <td className="py-3 px-6 text-left">
                      {log.date.slice(0, 19)}
                    </td>
                    <td className="py-3 px-6 text-left">{log.ip}</td>
                    <td className="py-3 px-6 text-left">{log.browser}</td>
                    <td className="py-3 px-6 text-left">{log.os}</td>
                  </tr>
                ))}
              </tbody>
            }
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  logs: state.channel.logs,
  adminLogs: state.channel.adminLogs,
  videos: state.video.videos
});

export default connect(mapStateToProps, {
  getLogs,
  getAdminLogs,
  getChannelVideos
})(Dashboard);

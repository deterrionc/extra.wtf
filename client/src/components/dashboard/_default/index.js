import React from "react";
import { connect } from "react-redux";
import { getLogs, getChannelVideos, getIpFilteredLogs } from "../../../actions/channel";

const Dashboard = ({ getChannelVideos, getLogs, getIpFilteredLogs, logs, videos }) => {
  // const [showLogType, setShowLogType] = React.useState('all')

  const [ip, setIp] = React.useState('');

  React.useEffect(() => {
    getLogs();
    getChannelVideos();
  }, [getLogs, getChannelVideos]);

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
                  Last Played
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
                  <td className="py-3 px-6 text-left">
                    {formatDateTime(video.playedAt)}
                  </td>
                  <td className="py-3 px-6 text-left">{video.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <h2 className="text-xl font-medium mb-4">Last Played 50 Videos</h2>
        <div className="flex items-center mb-4">
          <input 
            type="text"
            className="py-2 px-3"
            value={ip}
            onChange={e => setIp(e.target.value)}
          />
          <button
            className="py-2 px-3 rounded bg-teal-900 text-white"
            onClick={() => getIpFilteredLogs(ip)}
          >
            Filter
          </button>
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
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

const formatDateTime = (T) => {
  if (T.slice(0, 4) === "2001") {
    return "- New Video -";
  } else {
    return T.slice(0, 19);
  }
};

const mapStateToProps = (state) => ({
  logs: state.channel.logs,
  videos: state.video.videos,
});

export default connect(mapStateToProps, {
  getLogs,
  getChannelVideos, 
  getIpFilteredLogs,
})(Dashboard);

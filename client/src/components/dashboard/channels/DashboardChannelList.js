import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannels, deleteChannel } from '../../../actions/channel';
import { FaIcon } from '../../../container/atoms/FaIcon';

const DashboardChannelList = ({ getChannels, deleteChannel, channels }) => {
  useEffect(() => {
    getChannels();
  }, [getChannels]);

  return (
    <div className="p-3 bg-gray-100 rounded-lg flex flex-col">
      <h2 className="text-xl font-medium mb-4">Video Channel List</h2>

      <div className="flex items-center justify-end mb-4">
        <Link
          to="/dashboard/channels/create"
          className="py-2 px-3 rounded bg-lime-900 text-white"
        >
          Create A Channel
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">No</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-left">Videos</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {channels.map((channel, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left">{channel.name}</td>
                <td className="py-3 px-6 text-center">
                  <img
                    src={`/${channel.image}`}
                    alt="ChannelImage"
                    className="rounded-md w-32 mx-auto"
                  />
                </td>
                <td className="py-3 px-6 text-left">{channel.videos.length}</td>
                <td className="py-3 px-6 text-left">
                  <Link
                    to={`/dashboard/channels/${channel._id}`}
                    className="py-2 px-3 rounded bg-lime-900 text-white mx-1"
                  >
                    <FaIcon iconName="fa fa-eye" />
                  </Link>
                  <Link
                    to={`/dashboard/channels/edit/${channel._id}`}
                    className="py-2 px-3 rounded bg-blue-500 text-white mx-1"
                  >
                    <FaIcon iconName="fa fa-edit" />
                  </Link>
                  <button
                    className="py-2 px-3 rounded bg-red-500 text-white mx-1"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this channel?'
                        )
                      )
                        deleteChannel(channel._id);
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

DashboardChannelList.propTypes = {
  getChannels: PropTypes.func.isRequired,
  deleteChannel: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  channels: state.channel.channels
});

export default connect(mapStateToProps, { getChannels, deleteChannel })(
  DashboardChannelList
);
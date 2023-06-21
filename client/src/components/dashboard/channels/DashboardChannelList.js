import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannels } from '../../../actions/channel';

const DashboardChannelList = ({ getChannels, channels }) => {
  useEffect(() => {
    getChannels();
  }, [getChannels]);

  return (
    <div className="flex-1 p-3">
      <div className="p-3 bg-gray-100 rounded-lg">
        <div className="mb-4 float-right">
          <Link
            to="/dashboard/channels/create"
            className="py-2 px-3 rounded bg-lime-900 text-white"
          >
            Create A Channel
          </Link>
        </div>

        <h2 className="text-xl font-medium mb-4">Video Channel List</h2>

        <div class="overflow-x-auto">
          <table class="table-auto w-full">
            <thead>
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th class="py-3 px-6 text-left">No</th>
                <th class="py-3 px-6 text-left">Name</th>
                <th class="py-3 px-6 text-center">Image</th>
                <th class="py-3 px-6 text-left">Videos</th>
                <th class="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              {channels.map((channel, index) => (
                <tr
                  key={index}
                  class="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td class="py-3 px-6 text-left whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td class="py-3 px-6 text-left">{channel.name}</td>
                  <td class="py-3 px-6 text-center">
                    <img
                      src={`/${channel.image}`}
                      alt="ChannelImage"
                      class="rounded-md w-32 mx-auto"
                    />
                  </td>
                  <td class="py-3 px-6 text-left">{channel.videos.length}</td>
                  <td class="py-3 px-6 text-left"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

DashboardChannelList.propTypes = {
  getChannels: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  channels: state.channel.channels
});

export default connect(mapStateToProps, { getChannels })(DashboardChannelList);

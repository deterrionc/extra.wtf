import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaIcon } from '../../../../container/atoms/FaIcon';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannels } from '../../../../actions/channel';
import ChannelCard from '../../../../container/molecules/ChannelCard';

const Channels = ({ getChannels, channels }: any) => {
  useEffect(() => {
    getChannels();
  }, [getChannels]);

  return (
    <React.Fragment>
      <div className="py-3">
        <Link to="/video-channels">
          <h5 className="m-1 pb-3 text-lg font-bold leading-6">
            Video Channels <FaIcon iconName="fa-arrow-right" />
          </h5>
        </Link>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {channels.length &&
            channels.map((channel: any, index: number) => (
              <ChannelCard key={index} channel={channel} />
            ))}
        </div>
      </div>
    </React.Fragment>
  );
};

Channels.propTypes = {
  getChannels: PropTypes.func.isRequired,
  channels: PropTypes.oneOfType([PropTypes.array, PropTypes.any]).isRequired
};

const mapStateToProps = (state: any) => ({
  channels: state.channel.channels
});

export default connect(mapStateToProps, { getChannels })(Channels);

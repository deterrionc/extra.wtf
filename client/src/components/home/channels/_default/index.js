import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaIcon } from '../../../../container/atoms/FaIcon';
import { connect } from 'react-redux';
import { getChannels } from '../../../../actions/nchannel';
import NchannelCard from '../../../../container/molecules/NchannelCard';

const Channels = ({ getChannels, channels }) => {
  useEffect(() => {
    getChannels();
  }, [getChannels]);

  return (
    <React.Fragment>
      <div className="py-3">
        <Link to="/video-channels">
          <h5 className="m-1 pb-3 text-lg font-bold leading-6">
            Start <FaIcon iconName="fa-arrow-right" />
          </h5>
        </Link>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {channels.length &&
            channels.map((channel, index) => (
              <NchannelCard key={index} channel={channel} />
            ))}
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  channels: state.channel.channels
});

export default connect(mapStateToProps, { getChannels })(Channels);

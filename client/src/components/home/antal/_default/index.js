import React from "react";
import { Link } from "react-router-dom";
import { FaIcon } from "../../../../container/atoms/FaIcon";
import { connect } from "react-redux";
import AntalChannelCard from "../../../../container/molecules/AntalChannelCard";

const channels = [
  { number: 1, name: "Video 1" },
  { number: 2, name: "Video 2" },
  { number: 3, name: "Video 3" },
  { number: 4, name: "Video 4" },
];

const Channels = () => {
  return (
    <React.Fragment>
      <div className="py-3">
        <Link to="/video-channels">
          <h5 className="m-1 pb-3 text-lg font-bold leading-6">
            Start <FaIcon iconName="fa-arrow-right" />
          </h5>
        </Link>
        {/* <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {channels.length &&
            channels.map((channel, index) => (
              <ChannelCard key={index} channel={channel} />
            ))}
        </div> */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {channels.map((channel, index) => 
            <AntalChannelCard key={index} channel={channel} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(Channels);

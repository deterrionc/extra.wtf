import { Link } from 'react-router-dom';
import { FaIcon } from '../../../../container/atoms/FaIcon';

const VideoHeader = () => {
  return (
    <Link to="/video-channels" className="absolute top-0 left-0 p-1 z-20">
      <h5 className="m-1 text-xs sm:text-sm lg:text-lg font-bold leading-6">
        Channels <FaIcon iconName="fa-arrow-right" />
      </h5>
    </Link>
  );
};

export default VideoHeader;

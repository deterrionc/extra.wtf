import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaIcon } from "../../../../container/atoms/FaIcon";
import { connect } from "react-redux";
import { getSvideo } from "../../../../actions/svideo";
import { Link } from "react-router-dom";

const VideoRoom = ({ getSvideo }) => {
  let navigate = useNavigate();
  const params = useParams();
  const svideoId = params.id;
  const [svideo, setSvideo] = React.useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      let temp = await getSvideo(svideoId);
      setSvideo(temp);
    };

    fetchData();
  }, [getSvideo, svideoId]);

  useEffect(() => {
    if (svideo && videoRef.current) {
      videoRef.current.oncanplay = () => {
        videoRef.current
          .play().catch((err) => console.log(err));
      };
      videoRef.current.load();
    }
  }, [svideo]);

  const handleVideoEnd = () => {
    navigate('/')
  };

  return (
    <div className="py-3">
      <Link to="/videos">
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">
          Videos <FaIcon iconName="fa-arrow-right" />
        </h5>
      </Link>

      <video ref={videoRef} onEnded={handleVideoEnd} className="min-w-full" controls>
        <source src={svideo && `/${svideo.path}/${svideo.video}`} type="video/mp4" />
      </video>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // your mapping here
});

export default connect(mapStateToProps, { getSvideo })(VideoRoom);

import React from "react"
import { getSvideos } from "../../../../actions/svideo"
import { connect } from 'react-redux';
import VideoCardList from "../../../../container/organisms/VideoCardList"

const Videos = ({getSvideos, svideos }) => {
  React.useEffect(() => {
    getSvideos();
  }, [getSvideos]);

  return (
    <VideoCardList videos={svideos} link='/videos' linkName='Videos' />
  )
}

const mapStateToProps = (state) => ({
  svideos: state.svideo.svideos
});

export default connect(mapStateToProps, { getSvideos })(Videos);

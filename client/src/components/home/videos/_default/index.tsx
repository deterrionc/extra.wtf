import React from "react"
import { Link } from "react-router-dom"
import { FaIcon } from "../../../../container/atoms/FaIcon"
import tempData from '../../../../utils/temp.json'
import Video from "../../../../container/molecules/VideoCard"
const topVideos = tempData.videos

const Videos = () => {
  return (
    <React.Fragment>
      <div className="py-3">
        <Link to='/videos'>
          <h5 className="m-1 pb-3 text-lg font-bold leading-6">Videos <FaIcon iconName="fa-arrow-right" /></h5>
        </Link>
        <div className="grid grid-cols-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {topVideos.length && topVideos.map((video, index) =>
            <Video key={index} video={video} />
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Videos
import { useState, useEffect } from "react"
import VideoCard from "../molecules/VideoCard"
import { FaIcon } from "../atoms/FaIcon"
import { Link } from "react-router-dom"

const VideoCardList = ({ videos, link, linkName }) => {
  const [_videos, setVideos] = useState([])

  useEffect(() => {
    setVideos(videos)
  }, [videos])

  return (
    <div className="py-3">
      <Link to={link}>
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">{linkName} <FaIcon iconName="fa-arrow-right" /></h5>
      </Link>
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {_videos.length && _videos.map((video, index) =>
          <VideoCard key={index} video={video} />
        )}
      </div>
    </div>
  )
}

export default VideoCardList
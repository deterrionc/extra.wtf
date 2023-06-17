import { useState, useEffect } from "react"
import Video from "../molecules/VideoCard"
import { FaIcon } from "../atoms/FaIcon"
import { Link } from "react-router-dom"

interface VideoCardListProps {
  videos: any
}

const VideoCardList = ({ videos }: VideoCardListProps) => {
  const [_videos, setVideos] = useState([])

  useEffect(() => {
    setVideos(videos)
  }, [videos])

  return (
    <div className="py-3">
      <Link to='/videos'>
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">Videos <FaIcon iconName="fa-arrow-right" /></h5>
      </Link>
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {_videos.length && _videos.map((video, index) =>
          <Video key={index} video={video} />
        )}
      </div>
    </div>
  )
}

export default VideoCardList
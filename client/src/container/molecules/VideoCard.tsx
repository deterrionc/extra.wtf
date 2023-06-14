import { Link } from "react-router-dom"

interface VideoProps {
  video: {
    id: string,
    title: string,
    image: string,
  }
}

const VideoCard = ({ video }: VideoProps) => {
  return (
    <Link to={"/videos/" + video.id} className="m-1 width-calc bg-video-card rounded overflow-hidden">
      <img alt={video.title} src={video.image} />
      <div className="p-2">
        <div className="text-base">{video.title}</div>
      </div>
    </Link>
  )
}

export default VideoCard
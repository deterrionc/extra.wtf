import { Link } from "react-router-dom"

interface ChannelProps {
  channel: {
    _id: string,
    name: string,
    image: string,
    videos: any
  }
}

const ChannelCard = ({ channel }: ChannelProps) => {
  return (
    <Link to={"/video-channels/" + channel._id} className="m-1 width-calc bg-video-card rounded overflow-hidden">
      <img alt={channel.name} src={channel.image} className="w-full aspect-w-2 aspect-h-3" />
      <div className="p-2">
        <div className="text-base">{channel.name}</div>
      </div>
    </Link>
  )
}

export default ChannelCard
import { Link } from "react-router-dom"

interface ChannelProps {
  channel: {
    _id: string,
    name: string,
    image: string,
    videos: any,
    slug: string
  }
}

const ChannelCard = ({ channel }: ChannelProps) => {
  return (
    // <Link to={"/video-channels/" + channel._id} className="m-1 width-calc bg-video-card rounded overflow-hidden">
    <Link to={"/video-channels/" + channel.slug} className="m-1 width-calc bg-video-card rounded overflow-hidden">
      <img alt="NOIMAGE" src={channel.image} className="w-full aspect-[3/2]" />
      <div className="p-2">
        <div className="text-base">{channel.name}</div>
      </div>
    </Link>
  )
}

export default ChannelCard
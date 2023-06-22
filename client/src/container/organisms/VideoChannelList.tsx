import { useState, useEffect } from "react"
import ChannelCard from "../molecules/ChannelCard"
import { FaIcon } from "../atoms/FaIcon"
import { Link } from "react-router-dom"

interface VideoChannelListProps {
  channels: any
  link: string
  linkName: string
}

const VideoChannelList = ({ channels, link, linkName }: VideoChannelListProps) => {
  const [_channels, setChannels] = useState([])

  useEffect(() => {
    setChannels(channels)
  }, [channels])

  return (
    <div className="py-3">
      <Link to={link}>
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">{linkName} <FaIcon iconName="fa-arrow-right" /></h5>
      </Link>
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {_channels.length && _channels.map((channel, index) =>
          <ChannelCard key={index} channel={channel} />
        )}
      </div>
    </div>
  )
}

export default VideoChannelList
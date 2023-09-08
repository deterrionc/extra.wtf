import { Link } from "react-router-dom";

const ChannelCard = ({ channel }) => {
  return (
    <Link
      to={"/channels/" + channel.slug}
      className="m-1 width-calc bg-video-card rounded overflow-hidden"
    >
      <div className="flex h-32 overflow-hidden">
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <img
            alt="NOIMAGE"
            src={`/${channel.path}/${channel.image}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              height: "fit-content",
              minHeight: "-webkit-fill-available",
            }}
          />
        </div>
      </div>
      <div className="p-2">
        <div className="text-base">{channel.name}</div>
      </div>
    </Link>
  );
};

export default ChannelCard;

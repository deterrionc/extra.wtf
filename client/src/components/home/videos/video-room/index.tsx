import { Link } from "react-router-dom"
import { FaIcon } from "../../../../container/atoms/FaIcon"
import { useParams } from "react-router-dom"
import tempData from '../../../../utils/temp.json'

const VideoRoom = () => {
  const params = useParams()
  const videoID = params.id
  const videoItem = tempData.videos.find(video => video.id === videoID)

  const handleVideoEnd = () => {
    console.log("lalala")
  }

  return (
    <div className="py-3">
      <Link to='/videos'>
        <h5 className="m-1 pb-3 text-lg font-bold leading-6">Videos <FaIcon iconName="fa-arrow-right" /></h5>
      </Link>

      <video onEnded={handleVideoEnd} className="min-w-full" autoPlay controls>
        <source src={videoItem && videoItem.file} type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoRoom
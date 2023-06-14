import { Link } from "react-router-dom"
import Logo from "../atoms/Logo"

const Header = () => {
  return (
    <div className="flex justify-between items-center px-1 py-2">
      <div className="flex justify-start items-center">
        <Link to='/'>
          <Logo />
        </Link>
        <Link to='/videos'>
          <div className="pl-12">Videos</div>
        </Link>
        <Link to='/articles'>
          <div className="pl-6">Articles</div>
        </Link>
      </div>
      <div className="flex">
        <Link to='/login'>
          <div className="pl-6">Login</div>
        </Link>
      </div>
    </div>
  )
}

export default Header
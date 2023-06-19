import React, { useEffect, useState } from 'react';
import { FaIcon } from '../../container/atoms/FaIcon';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';

const DashboardSidebar: React.FC = ({ logout }: any) => {
  const [isNarrow, setIsNarrow] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('w-64');

  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (windowSize[0] < 769) {
      setIsNarrow(true);
      setSidebarWidth('w-');
    }
  }, [windowSize]);

  const toggleSidebar = () => {
    if (isNarrow) {
      setSidebarWidth('w-64');
      setIsNarrow(false);
    } else {
      setSidebarWidth('w-');
      setIsNarrow(true);
    }
  };

  return (
    <div className={`bg-gray-800 text-white p-3 ${sidebarWidth}`}>
      <div className="flex justify-end">
        <button
          className={`mb-5 py-2 px-3 rounded bg-lime-900 text-white hidden xl:block lg:block ${
            isNarrow ? 'w-full' : ''
          } `}
          onClick={toggleSidebar}
        >
          {isNarrow && <FaIcon iconName="fa-sliders" />}
          {!isNarrow && <FaIcon iconName="fa-arrow-circle-left" />}
        </button>
      </div>
      <nav className="text-xl font-bold">
        <hr className="border-lime-900 mb-2" />

        <Link
          to="/dashboard"
          className="flex items-center space-x-2 hover:bg-gray-100 hover:text-gray-800 hover:rounded p-2"
        >
          {isNarrow ? (
            <FaIcon
              iconName="fa-dashboard"
              className="w-narrow-sidebar-icon"
            />
          ) : (
            <>
              <FaIcon iconName="fa-dashboard" className="w-6" />
              <span className={`${isNarrow ? 'hidden' : 'block'} md:block`}>
                Dashboard
              </span>
            </>
          )}
        </Link>

        <Link
          to="/dashboard/videos"
          className="flex items-center space-x-2 hover:bg-gray-100 hover:text-gray-800 hover:rounded p-2"
        >
          {isNarrow ? (
            <FaIcon
              iconName="fa-file-movie-o"
              className="w-narrow-sidebar-icon"
            />
          ) : (
            <>
              <FaIcon iconName="fa-video-camera" className="w-6" />
              <span className={`${isNarrow ? 'hidden' : 'block'} md:block`}>
                Videos
              </span>
            </>
          )}
        </Link>

        <Link
          to="/dashboard/articles"
          className="flex items-center space-x-2 hover:bg-gray-100 hover:text-gray-800 hover:rounded p-2"
        >
          {isNarrow ? (
            <FaIcon iconName="fa-file-text" className="w-narrow-sidebar-icon" />
          ) : (
            <>
              <FaIcon iconName="fa-file-text" className="w-6" />
              <span className={`${isNarrow ? 'hidden' : 'block'} md:block`}>
                Articles
              </span>
            </>
          )}
        </Link>
        <Link
          to="/dashboard/settings"
          className="flex items-center space-x-2 hover:bg-gray-100 hover:text-gray-800 hover:rounded p-2"
        >
          {isNarrow ? (
            <FaIcon iconName="fa-cog" className="w-6 w-narrow-sidebar-icon" />
          ) : (
            <>
              <FaIcon iconName="fa-cogs" className="w-6" />
              <span className={`${isNarrow ? 'hidden' : 'block'} md:block`}>
                Settings
              </span>
            </>
          )}
        </Link>

        <hr className="border-lime-900 my-2" />

        <Link
          to="/"
          className="flex items-center space-x-2 hover:bg-gray-100 hover:text-gray-800 hover:rounded p-2"
        >
          {isNarrow ? (
            <FaIcon iconName="fa-home" className="w-narrow-sidebar-icon" />
          ) : (
            <>
              <FaIcon iconName="fa-home" className="w-6" />
              <span className={`${isNarrow ? 'hidden' : 'block'} md:block`}>
                Home
              </span>
            </>
          )}
        </Link>

        <button
          onClick={logout}
          className="flex items-center space-x-2 p-2 absolute bottom-0 mb-6"
        >
          {isNarrow ? (
            <FaIcon iconName="fa-sign-out" className="w-narrow-sidebar-icon" />
          ) : (
            <>
              <FaIcon iconName="fa-sign-out" className="w-6" />
              <span className={`${isNarrow ? 'hidden' : 'block'} md:block`}>
                Logout
              </span>
            </>
          )}
        </button>
      </nav>
    </div>
  );
};

DashboardSidebar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(DashboardSidebar);

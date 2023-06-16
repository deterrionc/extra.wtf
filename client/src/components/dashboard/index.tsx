import React, { useState } from 'react';
import { FaIcon } from '../../container/atoms/FaIcon';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminDashboard: React.FC = ({ logout, isAuthenticated }: any) => {
  let navigate = useNavigate();
  const [isNarrow, setIsNarrow] = useState(false);

  const toggleSidebar = () => {
    setIsNarrow(!isNarrow);
  };

  if (!isAuthenticated) {
    navigate('/');
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <div
        className={`xl:w-64 lg:w-64 md:w-24 sm:w-24 xs:w-24 bg-gray-800 text-white p-3 w-${
          isNarrow ? 'narrow-sidebar' : '64'
        } `}
      >
        <div className="flex justify-end">
          <button
            className={`mb-5 py-2 px-3 rounded bg-blue-500 text-white hidden xl:block lg:block ${
              isNarrow ? 'w-full' : ''
            } `}
            onClick={toggleSidebar}
          >
            {isNarrow && <FaIcon iconName="fa-sliders" />}
            {!isNarrow && <FaIcon iconName="fa-arrow-circle-left" />}
          </button>
        </div>
        <nav className="text-xl font-bold">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:bg-gray-100 hover:text-gray-800 hover:rounded p-2"
          >
            {isNarrow ? (
              <FaIcon iconName="fa-home" className="w-6 w-narrow-sidebar-icon" />
            ) : (
              <>
                <FaIcon iconName="fa-home" className="w-6" />
                <span className={`${isNarrow ? 'hidden' : 'block'} md:block`}>
                  Home
                </span>
              </>
            )}
          </Link>
          <Link
            to="/dashboard/videos"
            className="flex items-center space-x-2 hover:bg-gray-100 hover:text-gray-800 hover:rounded p-2"
          >
            {isNarrow ? (
              <FaIcon iconName="fa-file-movie-o" className="w-6 w-narrow-sidebar-icon" />
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
              <FaIcon iconName="fa-file-text" className="w-6 w-narrow-sidebar-icon" />
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
          <button
            onClick={logout}
            className="flex items-center space-x-2 p-2 absolute bottom-0 mb-6"
          >
            {isNarrow ? (
              <FaIcon iconName="fa-sign-out" className="w-6 w-narrow-sidebar-icon" />
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
      <div className="flex-grow bg-gray-100 p-3">Admin Dashboard</div>
    </div>
  );
};

AdminDashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(AdminDashboard);

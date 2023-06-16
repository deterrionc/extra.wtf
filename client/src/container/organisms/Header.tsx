import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Header = ({ isAuthenticated }: any) => {
  return (
    <div className="flex justify-between items-center px-1 py-2">
      <div className="flex justify-start items-center">
        <Link to="/">
          <Logo />
        </Link>
        <Link to="/videos">
          <div className="pl-12">Videos</div>
        </Link>
        <Link to="/articles">
          <div className="pl-6">Articles</div>
        </Link>
      </div>
      <div className="flex">
        {isAuthenticated ? (
          <Link to="/dashboard">
            <div className="pl-6">Dashboard</div>
          </Link>
        ) : (
          <Link to="/auth/login">
            <div className="pl-6">Login</div>
          </Link>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Header);

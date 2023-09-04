import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import DashboardSidebar from './DashboardSidebar';
import DashboardTheme from '../../container/theme/DashboardTheme';
import Dashboard from './_default';
import DashboardVideoContainer from './videos';
import DashboardChannelContainer from './channels';
import CategoryContainer from './categories';
import DashboardArticleContainer from './articles';

const AdminDashboard: React.FC = ({ isAuthenticated }: any) => {
  let navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/');
  }

  return (
    <DashboardTheme>
      <DashboardSidebar />
      <div className='overflow-auto flex-1 p-3'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/channels/*" element={<DashboardChannelContainer />} />
          <Route path="/categories/*" element={<CategoryContainer />} />
          <Route path="/videos/*" element={<DashboardVideoContainer />} />
          <Route path="/articles/*" element={<DashboardArticleContainer />} />
        </Routes>
      </div>
    </DashboardTheme>
  );
};

AdminDashboard.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(AdminDashboard);

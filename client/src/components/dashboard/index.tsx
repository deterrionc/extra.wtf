import React from 'react';
import { connect } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import DashboardSidebar from './DashboardSidebar';
import DashboardTheme from '../../container/theme/DashboardTheme';
import Dashboard from './_default';

const AdminDashboard: React.FC = ({ isAuthenticated }: any) => {
  let navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/');
  }

  return (
    <DashboardTheme>
      <DashboardSidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/videos/*" element={<Dashboard />} />
        <Route path="/articles/*" element={<Dashboard />} />
      </Routes>
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

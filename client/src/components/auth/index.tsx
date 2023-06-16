import Header from '../../container/organisms/Header';
import HomeTheme from '../../container/theme/HomeTheme';
import { Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './register';

const AuthContainer = () => {
  return (
    <HomeTheme>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HomeTheme>
  );
};

export default AuthContainer;

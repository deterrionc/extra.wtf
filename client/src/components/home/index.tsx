import Header from '../../container/organisms/Header';
import HomeTheme from '../../container/theme/HomeTheme';
import { Routes, Route } from 'react-router-dom';
import Home from './_default';
import VideoContainer from './videos';
import ArticleContainer from './articles';

const HomeContainer = () => {
  return (
    <HomeTheme>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos/*" element={<VideoContainer />} />
        <Route path="/articles/*" element={<ArticleContainer />} />
      </Routes>
    </HomeTheme>
  );
};

export default HomeContainer;

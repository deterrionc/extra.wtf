import VideoCardList from '../../../container/organisms/VideoCardList'
import ArticleCardList from '../../../container/organisms/ArticleCardList'
import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannels } from '../../../actions/nchannel';
// import VideoChannelList from '../../../container/organisms/VideoChannelList';
import { getArticles } from "../../../actions/article";
import { getSvideos } from '../../../actions/svideo';
import ChannelList from '../../../container/organisms/ChannelList';

const Home = ({ getChannels, channels, getArticles, getSvideos, articles, svideos }: any) => {
  useEffect(() => {
    getChannels();
    getArticles();
    getSvideos();
  }, [getChannels, getArticles, getSvideos]);
  
  return (
    <div className='pb-5'>
      <ChannelList channels={channels} link='/channels' linkName='Start' />
      {/* <VideoChannelList channels={channels} link='/video-channels' linkName='Start' /> */}
      <VideoCardList videos={svideos} link='/videos' linkName='Videos' />
      <ArticleCardList articles={articles} />
    </div>
  )
}

Home.propTypes = {
  getChannels: PropTypes.func.isRequired,
  getArticles: PropTypes.func.isRequired,
  getSvideos: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  channels: state.channel.channels,
  svideos: state.svideo.svideos,
  articles: state.article.articles
});

export default connect(mapStateToProps, { getChannels, getArticles, getSvideos })(Home);

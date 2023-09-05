import React from 'react'
import tempData from '../../../utils/temp.json'
import VideoCardList from '../../../container/organisms/VideoCardList'
import ArticleCardList from '../../../container/organisms/ArticleCardList'
import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannels } from '../../../actions/channel';
import VideoChannelList from '../../../container/organisms/VideoChannelList';
import { getArticles } from "../../../actions/article";

const topVideos = tempData.videos

const Home = ({ getChannels, channels, getArticles, articles }: any) => {
  useEffect(() => {
    getChannels();
    getArticles();
  }, [getChannels, getArticles]);
  
  return (
    <React.Fragment>
      <VideoChannelList channels={channels} link='/video-channels' linkName='Start' />
      <VideoCardList videos={topVideos} link='/videos' linkName='Videos' />
      <ArticleCardList articles={articles} />
    </React.Fragment>
  )
}

Home.propTypes = {
  getChannels: PropTypes.func.isRequired,
  getArticles: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  channels: state.channel.channels,
  articles: state.article.articles
});

export default connect(mapStateToProps, { getChannels, getArticles })(Home);

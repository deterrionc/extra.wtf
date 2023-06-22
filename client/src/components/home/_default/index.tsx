import React from 'react'
import tempData from '../../../utils/temp.json'
import VideoCardList from '../../../container/organisms/VideoCardList'
import ArticleCardList from '../../../container/organisms/ArticleCardList'
import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getChannels } from '../../../actions/channel';
import VideoChannelList from '../../../container/organisms/VideoChannelList';

const topArticles = tempData.articles
const topVideos = tempData.videos

const Home = ({ getChannels, channels }: any) => {
  useEffect(() => {
    getChannels();
  }, [getChannels]);
  
  return (
    <React.Fragment>
      <VideoChannelList channels={channels} link='/video-channels' linkName='Video Channels' />
      <VideoCardList videos={topVideos} link='/videos' linkName='Videos' />
      <ArticleCardList articles={topArticles} />
    </React.Fragment>
  )
}

Home.propTypes = {
  getChannels: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  channels: state.channel.channels
});

export default connect(mapStateToProps, { getChannels })(Home);

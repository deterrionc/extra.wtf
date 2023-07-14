import api from "../utils/api";
import { setAlert } from './alert';
import formApi from "../utils/formApi";
import {
  ADMIN_LOGS_LOADED,
  CHANNELS_LOADED,
  CHANNEL_LOADED,
  LOGS_LOADED,
  VIDEOS_LOADED,
} from "./types";

export const createChannel =
  (formData, navigate, folder) => async (dispatch) => {
    const res = await formApi.post(
      `/channels/create-channel/${folder}`,
      formData
    );

    if (res.data.success) {
      dispatch(getChannels());
      navigate("/dashboard/channels");
    } else {
      // alert(res.data.message);
      dispatch(setAlert(res.data.message, 'error'));
    }
  };

export const getChannels = () => async (dispatch) => {
  const res = await api.get("/channels/get-channels");

  if (res.data.success) {
    dispatch({
      type: CHANNELS_LOADED,
      payload: res.data.channels,
    });
  }
};

export const getChannel = (channelID) => async (dispatch) => {
  const res = await api.get(`/channels/get-channel/${channelID}`);

  if (res.data.success) {
    dispatch({
      type: CHANNEL_LOADED,
      payload: res.data.channel,
    });
  }
};

export const getChannelBySlug = (slug) => async (dispatch) => {
  const res = await api.get(`/channels/get-channel-by-slug/${slug}`);

  if (res.data.success) {
    dispatch({
      type: CHANNEL_LOADED,
      payload: res.data.channel,
    });
  }
};

export const updateChannel =
  (channelID, formData, navigate) => async (dispatch) => {
    const res = await formApi.post(
      `/channels/update-channel/${channelID}`,
      formData
    );

    if (res.data.success) {
      dispatch(getChannels());
      navigate("/dashboard/channels");
    } else {
      // alert(res.data.message);
      dispatch(setAlert(res.data.message, 'error'));
    }
  };

export const deleteChannel = (channelID) => async (dispatch) => {
  const res = await api.delete(`/channels/delete-channel/${channelID}`);

  if (res.data.success) {
    dispatch(getChannels());
  }
};

export const getChannelVideos = (channelID) => async (dispatch) => {
  const res = await api.get(`/channels/get-channel-videos/${channelID}`);

  if (res.data.success) {
    dispatch({
      type: VIDEOS_LOADED,
      payload: res.data,
    });

    return res.data.videos;
  }
};

export const updateVideoPlayedAt = (videoID, slug) => async (dispatch) => {
  const res = await api.get(`/channels/update-video-playedAt/?videoID=${videoID}&slug=${slug}`);

  if (res.data.success) {
    return true;
  }
};

export const getFirstVideo = async (slug) => {
  const res = await api.get(`/channels/get-first-video/${slug}`);

  if (res.data.success) {
    return res.data;
  }
};

export const getNextVideo = async (videoID, videoType, slug) => {
  const res = await api.get(
    `/channels/get-next-video/?videoID=${videoID}&type=${videoType}&slug=${slug}`
  );

  if (res.data.success) {
    return res.data.video;
  }
};

export const getLogs = (channelID) => async (dispatch) => {
  const res = await api.get(`/channels/get-logs/${channelID}`);

  if (res.data.success) {
    dispatch({
      type: LOGS_LOADED,
      payload: res.data.logs,
    });
  }
};

export const getAdminLogs = () => async (dispatch) => {
  const res = await api.get("/channels/get-admin-logs");

  if (res.data.success) {
    dispatch({
      type: ADMIN_LOGS_LOADED,
      payload: res.data.logs,
    });
  }
};

export const getIpFilteredLogs = (ip, channelID) => async (dispatch) => {
  const res = await api.post(`/channels/get-ip-filtered-logs`, { ip, channelID });

  if (res.data.success) {
    dispatch({
      type: LOGS_LOADED,
      payload: res.data.logs,
    });
  }
};

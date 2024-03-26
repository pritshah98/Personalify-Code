import axios from 'axios';
import moment from 'moment';

export const getApiAccessToken = () => async (dispatch) => {
  try {
    const code = window.location.search.split('=')[1];
    if (code !== 'access_denied') {
      const res = await axios.get(`/spotify/first_token/${code}`);
      dispatch({
        type: 'TOKEN_RECEIVED',
        payload: res.data,
      });
    }
  } catch (error) {
    console.error(error.message);
    dispatch({
      type: 'TOKEN_FAIL',
    });
  }
};

export const refreshAccessToken = (time, token) => async (dispatch) => {
  const currTime = moment().format('MMMM Do YYYY, h:mm:ss a');
  if (moment(time).isAfter(moment(currTime).subtract(1, 'hours'))) {
    try {
      const res = await axios.get(`/spotify/refresh_token/${token}`);
      dispatch({
        type: 'TOKEN_REFRESHED',
        payload: res.data,
      });
    } catch (error) {
      console.error(error.message);
      dispatch({
        type: 'TOKEN_FAIL',
      });
    }
  } else {
    dispatch({
      type: 'TOKEN_NOT_REFRESHED',
    });
  }
};

export const getSpotifyProfileData = (token) => async (dispatch) => {
  try {
    const res = await axios.get(`/spotify/me/${token}`);
    console.log(res.data);
  } catch (error) {
    console.error(error.message);
  }
};

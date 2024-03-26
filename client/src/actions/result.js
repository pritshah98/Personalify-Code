import axios from 'axios';

// Add filter to reducer
export const setFilter = (result) => (dispatch) => {
  try {
    dispatch({
      type: 'SET_RESULT',
      payload: result,
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Add playlist to reducer
export const setResult = (filter, token) => async (dispatch) => {
  try {
    const res = await axios.get(`/spotify/playlist/${filter}/${token}`);
    dispatch({
      type: 'SET_PLAYLIST',
      payload: res.data,
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Clear playlist in reducer
export const clearResult = () => async (dispatch) => {
  try {
    dispatch({
      type: 'CLEAR_PLAYLIST',
    });
  } catch (error) {
    console.error(error.message);
  }
};

import moment from 'moment';

const initialState = {
  access_token: null,
  refresh_token: null,
  token_set_time: '',
  isAuthenticated: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'TOKEN_NOT_REFRESHED':
      return state;
    case 'TOKEN_REFRESHED':
      localStorage.setItem('accessToken', payload.access_token);
      localStorage.setItem(
        'accessTime',
        moment().format('MMMM Do YYYY, h:mm:ss a')
      );
      return {
        ...state,
        access_token: payload,
        token_set_time: moment().format('MMMM Do YYYY, h:mm:ss a'),
      };
    case 'TOKEN_RECEIVED':
      localStorage.setItem('accessToken', payload.access_token);
      localStorage.setItem(
        'accessTime',
        moment().format('MMMM Do YYYY, h:mm:ss a')
      );
      localStorage.setItem('refreshToken', payload.refresh_token);
      return {
        ...state,
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        token_set_time: moment().format('MMMM Do YYYY, h:mm:ss a'),
        isAuthenticated: true,
      };
    case 'TOKEN_FAIL':
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessTime');
      return {
        ...state,
        access_token: null,
        refresh_token: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

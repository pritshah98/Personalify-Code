const initialState = {
  result: [],
  playlist: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_RESULT':
      return {
        ...state,
        result: payload,
      };
    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: payload,
      };
    case 'CLEAR_PLAYLIST':
      return {
        ...state,
        playlist: {},
      };
    default:
      return state;
  }
}

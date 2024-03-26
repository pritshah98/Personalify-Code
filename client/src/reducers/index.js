import { combineReducers } from 'redux';
import auth from './auth';
import result from './result';

export default combineReducers({
  auth,
  result,
});

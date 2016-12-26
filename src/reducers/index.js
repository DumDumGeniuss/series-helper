import { combineReducers } from 'redux';
import user from './user.js';
import series from './series.js';

const reducers = combineReducers({
	user,
	series,
});

export default reducers;

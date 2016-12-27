import * as userConstant from '../constants/user.js';

const initState = {
	myProfile: null,
};

export default function user(state = initState, action) {
	switch (action.type) {
	case userConstant.SET_MY_PROFILE:
		return Object.assign({}, state, {myProfile: action.user});
	case userConstant.CLEAR_MY_PROFILE:
		return Object.assign({}, state, {myProfile: null});
	default:
		return state;
	}
}

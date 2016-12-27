import * as userConstant from '../constants/user.js';
import * as userApi from '../apis/user.js';

export function setMyProfileOptimistic(user) {
	return {
		type: userConstant.SET_MY_PROFILE,
		user: user,
	};
}

export function setMyProfile(user) {
	return dispatch => {
		userApi.addUser(user)
			.then((res) => {
				dispatch(setMyProfileOptimistic(res));
			});
	}
}

export function clearMyProfileOptimistic() {
	return {
		type: userConstant.CLEAR_MY_PROFILE,
	}
}

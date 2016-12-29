import * as userConstant from '../constants/user.js';
import * as userApi from '../apis/user.js';
import fb from '../apis/fb.js';

export function setMyProfileOptimistic(user) {
	return {
		type: userConstant.SET_MY_PROFILE,
		user: user,
	};
}

export function setMyProfile() {
	return dispatch => {
		fb.getMyProfile()
			.then((res) => {
				return userApi.addUser(res);
			})
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

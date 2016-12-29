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
	let user;
	return dispatch => {
		fb.getMyProfile()
			.then((res) => {
				user = res;
				userApi.addUser(res);
				return fb.getUerPhoto(user._id);
			})
			.then((res) => {
				user.picture = res;
				dispatch(setMyProfileOptimistic(user));
			});
	}
}

export function clearMyProfileOptimistic() {
	return {
		type: userConstant.CLEAR_MY_PROFILE,
	}
}

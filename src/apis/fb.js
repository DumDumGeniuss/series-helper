import * as userApi from './user.js';


const fb = {
	getMyProfile: () => {
		return new Promise((resolve) => {
			FB.api('/me', (response) => {
				const user = {
					email: response.email,
					provider: 'facebook',
					name: response.name,
					_id: response.id,
				};
				resolve(user);
			});
		});
	},
	login: () => {
		let fbResponse;
		return new Promise((resolve, reject) => {
			FB.login((response) => {
				if (response.status === 'connected') {
					fbResponse = response;
					fbResponse._id = fbResponse.authResponse.userID;
					/* Save tokens */
					localStorage.setItem('authToken', fbResponse.authResponse.accessToken);
					resolve(fbResponse);
				} else if (response.status === 'not_authorized') {
					reject('Log in with facebook failed');
				} else {
					reject('Log in failed');
				}
			}, {scope: 'email'});
		});
	},
	checkLogin: () => {
		const user = {};
		let fbResponse;
		return new Promise((resolve) => {
			FB.getLoginStatus((response) => {
				fbResponse = response;
				if (fbResponse.authResponse) {
					user._id = fbResponse.authResponse.userID;
					/* Save tokens */
					localStorage.setItem('authToken', fbResponse.authResponse.accessToken);
					userApi.updateUser(user);
					resolve(fbResponse);
				} else {
					resolve(fbResponse);
				}
			});
		});
	},
	getUerPhoto: (userId) => {
		return new Promise((resolve) => {
			FB.api('/' + userId + '/picture', (response) => {
				resolve(response.data.url);
			});
		});
	},
	logOut: () => {
		return new Promise((resolve, reject) => {
			resolve('Log out successfully');
			FB.logout(() => {
				reject('you have already logged out');
			});
		});
	},
};

export default fb;

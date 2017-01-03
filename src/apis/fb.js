import * as userApi from './user.js';


const fb = {
	getMyProfile: function () {
		return new Promise((resolve, reject) => {
			FB.api('/me', (response) => {
				let user = {
					email: response.email,
					provider: 'facebook',
					name: response.name,
					_id: response.id
				};
				resolve(user);
			});
		});
	},
	login: function () {
		let user={};
		let fbResponse;
		return new Promise((resolve, reject) => {
			FB.login(function(response) {
				if (response.status === 'connected') {
					fbResponse = response;
					fbResponse._id = fbResponse.authResponse.userID;
					/* Save tokens */
					localStorage.setItem("authToken", fbResponse.authResponse.accessToken);
					resolve(fbResponse);
				} else if (response.status === 'not_authorized') {
					reject('Log in with facebook failed');
				} else {
					reject('Log in failed');
				}
			}, {scope: 'email'});
		});
	},
	checkLogin: function () {
		let user={};
		let fbResponse;
		return new Promise((resolve, reject) => {
			FB.getLoginStatus(function(response) {
				fbResponse = response
				if(fbResponse.authResponse) {
					user._id = fbResponse.authResponse.userID;
					/* Save tokens */
					localStorage.setItem("authToken", user.authToken);
					userApi.updateUser(user);
					resolve(fbResponse);
				} else {
					resolve(fbResponse);
				}
			})
		});
	},
	getUerPhoto: function (userId) {
		return new Promise((resolve, reject) => {
			FB.api('/'+userId+'/picture', (response) => {
				resolve(response.data.url);
			});
		});
	},
	logOut: function() {
		return new Promise((resolve, reject) => {
			resolve('Log out successfully');
			FB.logout((response) => {
				reject('you have already logged out');
			});
		});
	}
};

export default fb;

import * as userApi from './user.js';


// const getCookie = (name) => {
// 	let sep_1 = "; " + document.cookie;
// 	let parts = sep_1.split("; " + name + "=");
// 	return parts.pop().split(";")[0];
// };
// const setCookie = (name, value) => {
// 	if (getCookie(name)) {
// 		document.cookie = name + "=; Max-Age=0";
// 	}
// 	document.cookie = name + "=" + value + ";path=";
// };
// const deleteCookie = (name) => {
// 	document.cookie = name + "=; Max-Age=0";
// };

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
				console.log(response);
				if (response.status === 'connected') {
					fbResponse = response;
					user._id = fbResponse.authResponse.userID;
					user.authToken = fbResponse.authResponse.accessToken;
					/* Save tokens */
					localStorage.setItem("authToken", user.authToken);

					userApi.updateUser(user)
						.then((res)=> {
							resolve(fbResponse);
						});
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
				user._id = fbResponse.authResponse.userID;
				user.authToken = fbResponse.authResponse.accessToken;
				/* Save tokens */
				localStorage.setItem("authToken", user.authToken);
				
				userApi.updateUser(user)
					.then((res)=> {
						resolve(fbResponse);
					});
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

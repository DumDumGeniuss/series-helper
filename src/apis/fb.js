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
		return new Promise((resolve, reject) => {
			FB.login(function(response) {
				if (response.status === 'connected') {
					resolve('connected success');
				}
				if (response.status === 'not_authorized') {
					reject('Log in with facebook failed');
				}
				reject('Log in failed');
			}, {scope: 'email'});
		});
	},
	checkLogin: function () {
		return new Promise((resolve, reject) => {
			FB.getLoginStatus(function(response) {
				if(response.status !== 'connected') {
					reject('Login Failed');
				}
				resolve(response);
			});
		});
	}
};

export default fb;

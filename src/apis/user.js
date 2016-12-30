require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

export const getUser = (_id) => {
	return fetch(process.env.API + '/users/' + _id)
		.then((res) => {
			return res.json();
		});
};

export const updateUser = (user) => {
	return fetch(process.env.API + '/users/auth', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		body: JSON.stringify(user)
	})
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			return res;
		})
		.catch(err => {
			console.log('登錄失敗');
		})
};

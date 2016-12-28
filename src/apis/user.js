require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

export const getUser = (_id) => {
	fetch(process.env.API + '/users/' + _id)
		.then((res) => {
			res.json();
		});
};

export const addUser = (user) => {
	return fetch(process.env.API + '/users', {
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
			alert('登錄失敗');
		})
};

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

export const getUser = () => {
	fetch('http://localhost:9000/user')
		.then((res) => {
			res.json();
		});
};

export const addUser = (user) => {
	return fetch('http://localhost:9000/user', {
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
};

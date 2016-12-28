require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

export const getSeries = (_id) => {
	return fetch(process.env.API + '/series/' + _id)
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			return res;
		});
};

export const updateSeries = (series) => {
	return fetch(process.env.API + '/series/' + series._id, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		body: JSON.stringify(series)
	})
		.then((res) => {
			return res.json();
		})
		.then((res) => {
			return res;
		})
		.catch(err => {
			alert('儲存失敗');
		})
};

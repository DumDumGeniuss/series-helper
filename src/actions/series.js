import * as seriesConstant from '../constants/series.js';
import * as seriesApi from '../apis/series.js';

const testItemsBox = [
	{
		title: 'The Walking Dead',
		status: 0,
		items: [
			{
				status: 1,
				items: [
					{
						status: 2,
					},
					{
						status: 2,
					},
					{
						status: 2,
					},
				],
			},
			{
				status: 1,
				items: [
					{
						status: 2,
					},
					{
						status: 2,
					},
					{
						status: 0,
					},
				],
			},
		],
	},
];

export function updateSeriesOptimistic(series) {
	return {
		type: seriesConstant.UPDATE_SERIES,
		series: series,
	};
}

export function updateSeries(series) {
	let newSeries = JSON.parse(JSON.stringify(series));
	newSeries.items = JSON.stringify(newSeries.items);
	return dispatch => {
		seriesApi.updateSeries(newSeries)
			.then((res) => {
				res.items = JSON.parse(res.items);
				dispatch(updateSeriesOptimistic(res));
			})
			.catch((err) => {
				console.log('更新失敗！');
			});
	};
}

export function querySeriesOptimistic(series) {
	return {
		type: seriesConstant.QUERY_SERIES,
		series: series
	};
}

export function querySeries(seriesId) {
	return dispatch => {
		seriesApi.getSeries(seriesId)
			.then((res) => {
				res.items = JSON.parse(res.items);
				dispatch(querySeriesOptimistic(res));
			});
	}
}

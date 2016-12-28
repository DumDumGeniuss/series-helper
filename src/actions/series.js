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
	series.items = JSON.stringify(series.items);
	return dispatch => {
		seriesApi.updateSeries(series)
			.then((res) => {
				res.items = JSON.parse(res.items);
				dispatch(updateSeriesOptimistic(res));
			});
	};
}

export function querySeriesOptimistic(series) {
	return {
		type: seriesConstant.QUERY_SERIES,
		series: series
	};
}

export function querySeries(userId) {
	return dispatch => {
		seriesApi.getSeries(userId)
			.then((res) => {
				res.items = JSON.parse(res.items);
				dispatch(querySeriesOptimistic(res));
			});
	}
}

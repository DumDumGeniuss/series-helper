import * as seriesConstant from '../constants/series.js';

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

export function updateSeriesOptimistic(items) {
	return {
		type: seriesConstant.UPDATE_SERIES,
		items: items,
	};
}

export function updateSeries(items) {
	return updateSeriesOptimistic(items);
}

export function querySeriesOptimistic(items, userId) {
	return {
		type: seriesConstant.QUERY_SERIES,
		items: items,
		userId: userId,
	};
}

export function querySeries(userId) {
	return querySeriesOptimistic(testItemsBox, userId);
}

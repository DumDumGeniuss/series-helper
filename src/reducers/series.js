import * as seriesConstant from '../constants/series.js';

const initState = {
	items: [],
	userId: '',
};

export default function series(state = initState, action) {
	switch (action.type) {
	case seriesConstant.QUERY_SERIES:
		return Object.assign({}, state, {userId: action.userId, items: action.items});
	case seriesConstant.UPDATE_SERIES:
		return Object.assign({}, state, {items: action.items});
	default:
		return state;
	}
}

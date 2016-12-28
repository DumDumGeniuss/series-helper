import * as seriesConstant from '../constants/series.js';

const initState = {
	items: [],
	_id: '',
	public: false,
};

export default function series(state = initState, action) {
	switch (action.type) {
	case seriesConstant.QUERY_SERIES:
		return Object.assign({}, state, action.series);
	case seriesConstant.UPDATE_SERIES:
		return Object.assign({}, state, action.series);
	default:
		return state;
	}
}

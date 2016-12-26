import React from 'react';
import { Route, IndexRoute } from 'react-router';
import HomeContainer from '../containers/HomeContainer/HomeContainer.jsx';
import SeriesBoxContainer from '../containers/SeriesBoxContainer/SeriesBoxContainer.jsx';

export default (
	<Route path="/">
		<IndexRoute component={HomeContainer}>
		</IndexRoute>
		<Route path="/series" component={SeriesBoxContainer}>
		</Route>
	</Route>
);

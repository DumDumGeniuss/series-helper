import React from 'react';
import { Route, IndexRoute } from 'react-router';
import SeriesBoxContainer from '../containers/SeriesBoxContainer/SeriesBoxContainer.jsx';

export default (
	<Route path="/">
		<Route path="/series" component={SeriesBoxContainer}>
		</Route>
	</Route>
);

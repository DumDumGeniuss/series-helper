import React from 'react';
import { Route, IndexRoute } from 'react-router';
import SeriesBoxContainer from '../containers/SeriesBoxContainer/SeriesBoxContainer.jsx';
import HomeLayout from '../components/layout/HomeLayout/HomeLayout.jsx';

export default (
	<Route path="/" component={HomeLayout}>
		<Route path="/series" component={SeriesBoxContainer}>
		</Route>
	</Route>
);

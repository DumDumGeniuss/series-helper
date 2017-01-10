import React from 'react';
import { Route, IndexRoute } from 'react-router';
import SeriesBoxContainer from '../containers/SeriesBoxContainer/SeriesBoxContainer.js';
import HomeLayout from '../components/layout/HomeLayout/HomeLayout.js';
import HomePage from '../components/page/HomePage/HomePage.js';

export default (
	<Route path="/" component={HomeLayout}>
		<IndexRoute component={HomePage}>
		</IndexRoute>
		<Route path="/series" component={SeriesBoxContainer}>
		</Route>
		<Route path="/series/:userId" component={SeriesBoxContainer}>
		</Route>
	</Route>
);

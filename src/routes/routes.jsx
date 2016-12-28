import React from 'react';
import { Route, IndexRoute } from 'react-router';
import SeriesBoxContainer from '../containers/SeriesBoxContainer/SeriesBoxContainer.jsx';
import HomeLayout from '../components/layout/HomeLayout/HomeLayout.jsx';
import HomePage from '../components/page/HomePage/HomePage.jsx';

export default (
	<Route path="/" component={HomeLayout}>
		<IndexRoute component={HomePage}>
		</IndexRoute>
		<Route path="/series" component={SeriesBoxContainer}>
		</Route>
	</Route>
);

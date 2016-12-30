import React from 'react';
import { Link } from 'react-router';
import LogoBox from '../../box/LogoBox/LogoBox.jsx';

class HomePage extends React.Component {
	static get propTypes() {
		return {
		}
	}
	render () {
		const style = require('./HomePage.scss');
		// const seriesHelper = require('./SeriesHelper.png');
		return (
			<div className={style.homePageContainer}>
				<div className={style.firstZone}>
					<h1 className={style.firstZoneTitle}>Always get into trouble with forgetting your TV shows progress? Here's Series Helper!</h1>
					<Link to={'/series'} className={style.logoBoxContainer}>
						<LogoBox />
					</Link>
					<h1 className={style.firstZoneTitle}>Click icon above to get start</h1>
				</div>
				<div className={style.secondZone}>
					<h1 className={style.secondZoneTitle}>With Series Helper, you can keep track of every TV shows you watch.</h1>
					<h1 className={style.secondZoneTitle}>It's quite simple and very helpful. </h1>
					<h1 className={style.secondZoneTitle}>You don't need to install app, you don't have to register by email and password.</h1>
					<h1 className={style.secondZoneTitle}>Just facebook account and this website .</h1>
				</div>
				<div className={style.firstZone}>
					<h1 className={style.firstZoneTitle}>1. Login with facebook.</h1>
					<h1 className={style.firstZoneTitle}>2. Click icon above.</h1>
					<h1 className={style.firstZoneTitle}>3. Start to build your own TV show's .</h1>
				</div>
			</div>
		);
	}
}

export default HomePage;

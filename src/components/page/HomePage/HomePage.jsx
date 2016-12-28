import React from 'react';
import LogoBox from '../../box/LogoBox/LogoBox.jsx';
import { Link } from 'react-router'

class HomePage extends React.Component {
	static get propTypes() {
		return {
		}
	}
	render () {
		const style = require('./HomePage.scss');
		return (
			<div>
				<Link to={'/series'} className={style.logoBox}>
					<LogoBox/>
				</Link>
			</div>
		);
	}
}

export default HomePage;

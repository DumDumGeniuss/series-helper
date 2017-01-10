import React from 'react';
import { Link } from 'react-router'
import LoginButtonContainer from '../../../containers/LoginButtonContainer/LoginButtonContainer.js';

class HomeLayout extends React.Component {
	static get propTypes() {
		return {
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			children: React.PropTypes.array
		};
	}
	componentDidMount() {
	}
	render () {
		const style = require('./HomeLayout.scss');
		return (
			<div>
				<div className={style.header}>
					<Link to={'/'} className={style.webTitle}>
						<span>
							<b>Series Helper</b>
						</span>
					</Link>
					<div className={style.functionBox}>
						<LoginButtonContainer />
					</div>
				</div>
				<div className={style.content}>
					{this.props.children}
				</div>
				<div className={style.footer}>
					Copyright © DumDumGenius
				</div>
			</div>
		);
	}
}

export default HomeLayout;

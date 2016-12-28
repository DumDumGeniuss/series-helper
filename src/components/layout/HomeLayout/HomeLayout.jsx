import React from 'react';
import { Link } from 'react-router'
import LoginButtonContainer from '../../../containers/LoginButtonContainer/LoginButtonContainer.jsx';

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
	login() {
		FB.login(function(response) {
			if (response.status === 'connected') {
			} else if (response.status === 'not_authorized') {
			} else {
			}
		});
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
			</div>
		);
	}
}

export default HomeLayout;

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../actions/user.js';

import FacebookSquare from 'react-icons/lib/fa/facebook-square';
import fb from '../../apis/fb.js';

class LoginButtonContainer extends React.Component {
	static get propTypes() {
		return {
		}
	}
	constructor(props) {
		super(props);
		this.state = {
		};
		this.checkFbLogin.bind(this);
	}
	componentDidMount() {
		const self = this;
		if (!IS_FB_API_LOADED) {
			document.addEventListener("fb-api-loaded", function(e) {
				self.checkFbLogin();
			});
		} else {
			self.checkFbLogin();
		}
	}
	checkFbLogin() {
		const { actions } = this.props;
		let user;
		fb.checkLogin()
			.then((res) => {
				if(res.status!=='connected') {
					throw new Error('not logged in');
				}
				return fb.getMyProfile();
			})
			.then((res) => {
				user = res;
				return fb.getUerPhoto(user._id);
			})
			.then((res) => {
				user.picture = res;
				actions.setMyProfile(user);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	login() {
		const { actions } = this.props;
		let user;
		fb.login()
			.then((res) => {
				return fb.getMyProfile();
				// actions.setMyProfile();
			})
			.then((res) => {
				user = res;
				return fb.getUerPhoto(user._id);
			})
			.then((res) => {
				user.picture = res;
				actions.setMyProfile(user);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	logout() {
		const { actions } = this.props;
		fb.logOut()
			.then((res) => {
				actions.clearMyProfileOptimistic();
			})
			.catch((err) => {
				actions.clearMyProfileOptimistic();
			});
	}
	render () {
		const style = require('./LoginButtonContainer.scss');
		const { user } = this.props.state;
		return (
			<div>
				<div style={ {'display': user.myProfile?'none':'initial'} } className={style.loginButtonContainer} onClick={this.login.bind(this)}>
					Log in <FacebookSquare />
				</div>
				<div style={ {'display': user.myProfile?'initial':'none'} } className={style.loginButtonContainer} onClick={this.logout.bind(this)}>
					Log out <FacebookSquare />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		state: state,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(userActions, dispatch),
	};
}

/**
* Connect Redux with this Component. (Container is on of the design pattern of React-Redux) 
*/
export default connect(mapStateToProps, mapDispatchToProps)(LoginButtonContainer);

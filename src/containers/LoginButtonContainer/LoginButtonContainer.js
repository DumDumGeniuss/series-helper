import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../../actions/user.js';

import LoadingBox from '../../components/box/LoadingBox/LoadingBox.js';

import FacebookSquare from 'react-icons/lib/fa/facebook-square';
import fb from '../../apis/fb.js';

class LoginButtonContainer extends React.Component {
	static get propTypes() {
		return {
			state: React.PropTypes.object,
			actions: React.PropTypes.object,
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			onLoading: false,
		};
		this.checkFbLogin.bind(this);
	}
	componentDidMount() {
		const self = this;
		if (!IS_FB_API_LOADED) {
			document.addEventListener('fb-api-loaded', () => {
				self.checkFbLogin();
			});
		} else {
			self.checkFbLogin();
		}
	}
	checkFbLogin() {
		const { actions } = this.props;
		let userToUpdate;
		fb.checkLogin()
			.then((res) => {
				if (res.status !== 'connected') {
					throw new Error('not logged in');
				}
				return fb.getMyProfile();
			})
			.then((res) => {
				userToUpdate = res;
				return fb.getUerPhoto(userToUpdate._id);
			})
			.then((res) => {
				userToUpdate.picture = res;
				actions.setMyProfile(userToUpdate);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	login() {
		const self = this;
		const { actions } = self.props;
		let user;
		self.setState({
			onLoading: true,
		});
		fb.login()
			.then(() => {
				return fb.getMyProfile();
			})
			.then((res) => {
				user = res;
				return fb.getUerPhoto(user._id);
			})
			.then((res) => {
				user.picture = res;
				actions.setMyProfile(user);
				self.setState({
					onLoading: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	logout() {
		const self = this;
		const { actions } = self.props;
		self.setState({
			onLoading: true,
		});
		fb.logOut()
			.then(() => {
				actions.clearMyProfileOptimistic();
				self.setState({
					onLoading: false,
				});
			})
			.catch(() => {
				actions.clearMyProfileOptimistic();
			});
	}
	render() {
		const style = require('./LoginButtonContainer.scss');
		const { user } = this.props.state;
		const { onLoading } = this.state;
		return (
			<div>
				<div style={ {'display': user.myProfile ? 'none' : 'initial'} } className={style.loginButtonContainer} onClick={this.login.bind(this)}>
					登入
					<FacebookSquare className={onLoading ? style.invisible : ''} />
					<LoadingBox boxWidth={20} boxHeight={20} visible={onLoading} color={'yellow'}/>
				</div>
				<div style={ {'display': user.myProfile ? 'initial' : 'none'} } className={style.loginButtonContainer} onClick={this.logout.bind(this)}>
					登出
					<FacebookSquare className={onLoading ? style.invisible : ''} />
					<LoadingBox boxWidth={35} boxHeight={35} visible={onLoading} color={'yellow'}/>
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

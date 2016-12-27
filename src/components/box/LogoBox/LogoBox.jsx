import React from 'react';

class LogoBox extends React.Component {
	static get propTypes() {
		return {
		}
	}
	render () {
		const style = require('./LogoBox.scss');
		const funyee = require('./funyee.png');
		return (
			<div>
				<div className={style.logoCircle}>
					<figure>
						<img className={style.logo} src={funyee} />
					</figure>
				</div>
			</div>
		);
	}
}

export default LogoBox;

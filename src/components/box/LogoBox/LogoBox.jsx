import React from 'react';

class LogoBox extends React.Component {
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

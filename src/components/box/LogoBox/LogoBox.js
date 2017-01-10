import React from 'react';

class LogoBox extends React.Component {
	static get propTypes() {
		return {
		}
	}
	render () {
		const style = require('./LogoBox.scss');
		const seriesHelper = require('./SeriesHelper.png');
		const { boxWidth, boxHeight } = this.props; 
		return (
			<div style={ {width: boxWidth+'px', height: boxHeight+'px'} } className={style.logoCircle}>
				<figure>
					<img style={ {width: (boxWidth-50)+'px', height: (boxHeight-50)+'px'} } className={style.logo} src={seriesHelper} />
				</figure>
			</div>
		);
	}
}

export default LogoBox;

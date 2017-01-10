import React from 'react';
import Spinner from 'react-icons/lib/fa/spinner';

class LoadingBox extends React.Component {
	static get propTypes() {
		return {
			boxWidth: React.PropTypes.number,
			boxHeight: React.PropTypes.number,
			visible: React.PropTypes.bool,
			color: React.PropTypes.string,
		};
	}
	render() {
		const style = require('./LoadingBox.scss');
		const { boxWidth, boxHeight, visible, color } = this.props;
		return (
			<div style={ {width: boxWidth + 'px', height: boxHeight + 'px'} } className={visible ? style.loadingBox : style.invisible}>
				<Spinner style={ {width: boxWidth * 0.7 + 'px', height: boxHeight * 0.7 + 'px', color: color} } />
			</div>
		);
	}
}

export default LoadingBox;

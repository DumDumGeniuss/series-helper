import React from 'react';

class DialogModal extends React.Component {
	static get propTypes() {
		return {
			switchShowFunc: React.PropTypes.func,
			changeSeriesFunc: React.PropTypes.func,
			showModal: React.PropTypes.bool,
			title: React.PropTypes.string,
			elementId: React.PropTypes.string
		}
	}
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentWillReceiveProps(nextProps) {
	}
	componentDidMount() {
	}
	submit(submitFunc, switchShowFunc) {
		submitFunc();
		switchShowFunc();
	}
	render () {
		const style = require('./DialogModal.scss');
		const { switchShowFunc, submitFunc, showModal, title, elementId } = this.props;
		return (
			<div className={showModal?style.modalContainer:style.invisibleContainer}>
				<div className={style.background} onClick={switchShowFunc}></div>
				<div className={style.contentBox}>
					<h1 className={style.title}>
						<b>{title}</b>
					</h1>
					<div className={style.functionBar}>
						<span onClick={this.submit.bind(this, submitFunc, switchShowFunc)}>確認</span>
						<span onClick={switchShowFunc}>取消</span>
					</div>
				</div>
			</div>
		);
	}
}

export default DialogModal;

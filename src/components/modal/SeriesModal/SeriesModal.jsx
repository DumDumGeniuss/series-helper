import React from 'react';

class SeriesModal extends React.Component {
	static get propTypes() {
		return {
			switchShowFunc: React.PropTypes.func,
			changeSeriesFunc: React.PropTypes.func,
			showModal: React.PropTypes.bool,
			title: React.PropTypes.string,
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			series: {
				name: '請輸入名稱',
				link: '請輸入片源',
			}
		};
	}
	handleNameChange(e) {
		let series = this.state.series;
		series.name = e.target.value;
    	this.setState({
            series: series,
    	});
	}
	handleLinkChange(e) {
		let series = this.state.series;
		series.link = e.target.value;
    	this.setState({
            series: series,
    	});
	}
	submit(series, changeSeriesFunc, switchShowFunc) {
		changeSeriesFunc(series);
		switchShowFunc();
	}
	render () {
		const style = require('./SeriesModal.scss');
		const { switchShowFunc, changeSeriesFunc, showModal, title } = this.props;
		const { series } = this.state;
		return (
			<div style={ {'display': showModal?'initial':'none'} }className={style.modalContainer}>
				<div className={style.background} onClick={switchShowFunc}></div>
				<div className={style.contentBox}>
					<h1 className={style.title}>
						<b>{title}</b>
					</h1>
					<form>
						<div className={style.inputBox}>
							<label>Name</label>
							<input defaultValue={series.name} onChange={this.handleNameChange.bind(this)}/>
						</div>
						<div className={style.inputBox}>
							<label>Link</label>
							<input defaultValue={series.link} onChange={this.handleLinkChange.bind(this)}/>
						</div>
					</form>
					<div className={style.functionBar}>
						<span onClick={this.submit.bind(this, series, changeSeriesFunc, switchShowFunc)}>Confirm</span>
						<span onClick={switchShowFunc}>Cancel</span>
					</div>
				</div>
			</div>
		);
	}
}

export default SeriesModal;

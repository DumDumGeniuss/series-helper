import React from 'react';

class SeriesModal extends React.Component {
	static get propTypes() {
		return {
			switchShowFunc: React.PropTypes.func,
			changeSeriesFunc: React.PropTypes.func,
			showModal: React.PropTypes.bool,
			title: React.PropTypes.string,
			params: React.PropTypes.array,
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			series: {}
		};
	}
	componentDidMount() {
		const { params } = this.props;
		let series = this.state.series;
		for(let i = 0; i < params.length; i++) {
			series[params[i]] = params[i];
		}
    	this.setState({
            series: series,
    	});
	}
	handleParamChange(e, param) {
		let series = this.state.series;
		series[param] = e.target.value;
    	this.setState({
            series: series,
    	});
	}
	submit(series, submitFunc, switchShowFunc) {
		console.log(series);
		submitFunc(series);
		switchShowFunc();
	}
	render () {
		const style = require('./SeriesModal.scss');
		const { switchShowFunc, submitFunc, showModal, title, params } = this.props;
		const { series } = this.state;
		console.log(params);
		return (
			<div style={ {'display': showModal?'initial':'none'} }className={style.modalContainer}>
				<div className={style.background} onClick={switchShowFunc}></div>
				<div className={style.contentBox}>
					<h1 className={style.title}>
						<b>{title}</b>
					</h1>
					<form>
						{
							params.map( (item, index) => {
								return (
									<div key={index} className={style.inputBox}>
										<label>item</label>
										<input defaultValue={item} onChange={this.handleParamChange.bind(this, event, item)}/>
									</div>			
								);
							})
						}
					</form>
					<div className={style.functionBar}>
						<span onClick={this.submit.bind(this, series, submitFunc, switchShowFunc)}>Confirm</span>
						<span onClick={switchShowFunc}>Cancel</span>
					</div>
				</div>
			</div>
		);
	}
}

export default SeriesModal;

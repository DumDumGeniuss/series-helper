import React from 'react';

class InputModal extends React.Component {
	static get propTypes() {
		return {
			switchShowFunc: React.PropTypes.func,
			changeSeriesFunc: React.PropTypes.func,
			showModal: React.PropTypes.bool,
			title: React.PropTypes.string,
			params: React.PropTypes.array,
			elementId: React.PropTypes.string
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			series: {}
		};
	}
	componentWillReceiveProps(nextProps) {
		const { elementId } = this.props;
		const { params } = nextProps;
		for(let i = 0; i < params.length; i++) {
			let input = document.getElementById(elementId + i);
			input.value = params[i].value;
		}
	}
	componentDidMount() {
		const { params } = this.props;
		let series = this.state.series;
		for(let i = 0; i < params.length; i++) {
			series[params[i].title] = params[i];
		}
    	this.setState({
            series: series,
    	});
	}
	handleParamChange(params, e) {
		let series = this.state.series;
		series[params.title] = e.target.value;
    	this.setState({
            series: series,
    	});
	}
	submit(submitFunc, switchShowFunc) {
		const { elementId, params } = this.props;
		let series = {};
		for(let i = 0; i < params.length; i++) {
			let input = document.getElementById(elementId + i);
			series[params[i].title] = input.value;
		}
		submitFunc(series);
		switchShowFunc();
	}
	render () {
		const style = require('./InputModal.scss');
		const { switchShowFunc, submitFunc, showModal, title, params, elementId } = this.props;
		const { series } = this.state;
		return (
			<div className={showModal?style.modalContainer:style.invisibleContainer}>
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
										<label><b>{item.title}</b></label>
										<input id={elementId + index} placeholder={item.title || ''} defaultValue={item.value || ''} onChange={this.handleParamChange.bind(this, item)}/>
									</div>			
								);
							})
						}
					</form>
					<div className={style.functionBar}>
						<span onClick={this.submit.bind(this, submitFunc, switchShowFunc)}>確認</span>
						<span onClick={switchShowFunc}>取消</span>
					</div>
				</div>
			</div>
		);
	}
}

export default InputModal;

import React from 'react';

class NumberInputModal extends React.Component {
	static get propTypes() {
		return {
		}
	}
	constructor(props) {
		super(props);
		this.state = {
			showAlert: false,
			currentValue: '',
		};
	}
	componentWillReceiveProps(nextProps) {
		const { elementId } = this.props;
		const numberInput = document.getElementById(elementId);
		numberInput.value = '';
	}
	componentDidMount() {
		const { elementId } = this.props;
		const numberInput = document.getElementById(elementId);
		numberInput.value = '';
	}
	clickNumber(number) {
		this.setState({
			showAlert: false
		});
		const { elementId } = this.props;
		const numberInput = document.getElementById(elementId);
		if (parseInt(numberInput.value + number) >= 1000) {
			this.setState({
				showAlert: true
			});
			return;
		}
		numberInput.value += number;
		this.setState({
			currentValue: numberInput.value
		});
	}
	handleInputChange() {
		const { elementId } = this.props;
		const { currentValue } = this.state;
		const numberInput = document.getElementById(elementId);
		numberInput.value = currentValue;
	}
	submit(submitFunc, switchShowFunc) {
		const { elementId, defaultValue } = this.props;
		const numberInput = document.getElementById(elementId);
		submitFunc(numberInput.value.length===0?parseInt(defaultValue):parseInt(numberInput.value));
		switchShowFunc();
	}
	back() {
		this.setState({
			showAlert: false
		});
		const { elementId } = this.props;
		const numberInput = document.getElementById(elementId);
		let newValue = numberInput.value.substring(0, numberInput.value.length?(numberInput.value.length - 1):0);
		numberInput.value = newValue;		
	}
	render () {
		const style = require('./NumberInputModal.scss');
		const { switchShowFunc, submitFunc, showModal, elementId } = this.props;
		const { showAlert } = this.state;
		return (
			<div className={showModal?style.modalContainer:style.invisible}>
				<div className={style.background} onClick={switchShowFunc}></div>
				<div className={style.contentBox}>
					<h1 className={style.title}>請輸入數字</h1>
					<div className={style.inputBox}>
						<input id={elementId} onChange={this.handleInputChange.bind(this)}/>
					</div>
					<h1 className={showAlert?style.alert:style.invisible}>輸入數字太大</h1>
					<div className={style.numberBox}>
						<div onClick={this.clickNumber.bind(this, 1)} className={style.number}>1</div>
						<div onClick={this.clickNumber.bind(this, 2)} className={style.number}>2</div>
						<div onClick={this.clickNumber.bind(this, 3)} className={style.number}>3</div>
					</div>
					<div className={style.numberBox}>
						<div onClick={this.clickNumber.bind(this, 4)} className={style.number}>4</div>
						<div onClick={this.clickNumber.bind(this, 5)} className={style.number}>5</div>
						<div onClick={this.clickNumber.bind(this, 6)} className={style.number}>6</div>
					</div>
					<div className={style.numberBox}>
						<div onClick={this.clickNumber.bind(this, 7)} className={style.number}>7</div>
						<div onClick={this.clickNumber.bind(this, 8)} className={style.number}>8</div>
						<div onClick={this.clickNumber.bind(this, 9)} className={style.number}>9</div>
					</div>
					<div className={style.numberBox}>
						<div onClick={this.back.bind(this)} className={style.number}>退回</div>
						<div onClick={this.clickNumber.bind(this, 0)} className={style.number}>0</div>
						<div onClick={this.submit.bind(this, submitFunc, switchShowFunc)} className={style.number}>確認</div>
					</div>
				</div>
			</div>
		);
	}
}

export default NumberInputModal;

import React from 'react';
import MinusSquare from 'react-icons/lib/fa/minus-square';
import PlusSquare from 'react-icons/lib/fa/plus-square';
import Minus from 'react-icons/lib/fa/minus';
import Plus from 'react-icons/lib/fa/plus';

class ItemsBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showChild: false,
		};
	}
	switchChildDisplay() {
		this.setState({
			showChild: !this.state.showChild
		});
	}
	render () {
		const style = require('./ItemsBox.scss');
		const { item, children, prewords, order, updateStatusFunc, addItemFunc, deleteItemFunc } = this.props;
		const { showChild } = this.state;
		const title = item.title?item.title:(prewords + (order+1));
		let [signalColor, signalWord] = [];
		switch (item.status) {
		case 0:
			signalColor = style.red;
			signalWord = 'Never Seen';
			break;
		case 1:
			signalColor = style.orange;
			signalWord = 'In Progress';
			break;
		case 2:
			signalColor = style.green;
			signalWord = 'Done';
			break;
		default:
			break;
		}
		return (
			<div className={style.box}>
				<div className={style.titleContainer}>
					<span className={style.title}>{title}</span>
					<div className={style.light + ' ' + signalColor} onClick={updateStatusFunc}>{signalWord}</div>
					<div style={ {'display': children?'initial':'none'} }>
						<MinusSquare
							style={ {'display': showChild?'initial':'none'} }
							className={style.functionIcon}
							onClick={this.switchChildDisplay.bind(this)}
						/>
						<PlusSquare
							style={ {'display': showChild?'none':'initial'} }
							className={style.functionIcon}
							onClick={this.switchChildDisplay.bind(this)}
						/>
					</div>
				</div>
				<div style={ {'display': showChild?'initial':'none'} } className={style.content}>
					<div className={style.leftBox}>
						<Minus
							className={style.minusItemIcon}
							onClick={deleteItemFunc}
						/>
						<Plus
							className={style.addItemIcon}
							onClick={addItemFunc}
						/>
					</div>
					{children}
				</div>
			</div>
		);
	}
}

export default ItemsBox;

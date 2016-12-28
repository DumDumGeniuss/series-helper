import React from 'react';
import MinusSquare from 'react-icons/lib/fa/minus-square';
import PlusSquare from 'react-icons/lib/fa/plus-square';
import Minus from 'react-icons/lib/fa/minus';
import Plus from 'react-icons/lib/fa/plus';
import Film from 'react-icons/lib/fa/film';
import Edit from 'react-icons/lib/fa/edit';

class ItemsBox extends React.Component {
	static get propTypes() {
		return {
			item: React.PropTypes.object.isRequired,
			children: React.PropTypes.array,
			prewords: React.PropTypes.string,
			order: React.PropTypes.number,
			updateStatusFunc: React.PropTypes.func,
			addItemFunc: React.PropTypes.func,
			deleteItemFunc: React.PropTypes.func,
		}
	}
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
		const { item, children, prewords, order, updateStatusFunc, addItemFunc, deleteItemFunc, displayStyle, childNumber, childNumberPrewords } = this.props;
		const { showChild } = this.state;
		const title = item.title?item.title:(prewords + (order+1));
		const link = item.link?item.link:null;
		let [signalColor, signalWord] = [];
		switch (item.status) {
		case 0:
			signalColor = style.red;
			signalWord = 'prepare';
			break;
		case 1:
			signalColor = style.orange;
			signalWord = 'following';
			break;
		case 2:
			signalColor = style.green;
			signalWord = 'Done';
			break;
		default:
			break;
		}
		return (
			<div style={ {display: displayStyle} } className={style.box}>
				<div className={style.titleContainer}>
					<span className={style.title}>{title}</span>
					<div className={style.rightItems}>
						<span className={style.number}><b>{childNumberPrewords}{childNumber}</b></span>
						<div className={style.light + ' ' + signalColor} onClick={updateStatusFunc}>{signalWord}</div>
						<div style={ {'display': children?'initial':'none'} }>
							<Edit className={style.functionIcon} />
							<a style={ {'display': link?'initial':'none'} } href={link}>
								<Film className={style.functionIcon} />
							</a>
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
					<div className={style.childContainer}>
						{children}
					</div>
				</div>
			</div>
		);
	}
}

export default ItemsBox;

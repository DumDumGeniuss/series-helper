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
			clickEditFunc: React.PropTypes.func,
			deleteItemFunc: React.PropTypes.func,
			editable: React.PropTypes.bool,
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
		const { item, children, prewords, order, updateStatusFunc, addItemFunc, clickEditFunc, deleteItemFunc, displayStyle, childNumber, childNumberPrewords, editable } = this.props;
		const { showChild } = this.state;
		const title = item.title?item.title:(prewords + (order+1));
		const link = item.link?item.link:null;
		let [signalColor, signalWord] = [];
		switch (item.status) {
		case 0:
			signalColor = style.green;
			signalWord = '完成';
			break;
		case 1:
			signalColor = style.orange;
			signalWord = '追蹤';
			break;
		case 2:
			signalColor = style.orange;
			signalWord = 'follow';
			break;
		default:
			break;
		}
		return (
			<div style={ {display: displayStyle} } className={style.box}>
				<div className={style.titleContainer}>
					<span className={style.title}>{title || '沒有名稱'}</span>
					<div className={style.rightItems}>
						<span className={childNumber?style.number:style.invisible}><b>{childNumberPrewords}{childNumber}</b></span>
						<div className={style.light + ' ' + signalColor} onClick={editable?updateStatusFunc:(function(){})}>{signalWord}</div>
						<div style={ {'display': children?'initial':'none'} }>
							<Edit onClick={clickEditFunc} className={editable?style.functionIcon:style.invisible} />
							<a style={ {'display': link?'initial':'none'} } href={link} target={"_blank"}>
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
							className={editable?style.minusItemIcon:style.invisible}
							onClick={deleteItemFunc}
						/>
						<Plus
							className={editable?style.addItemIcon:style.invisible}
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

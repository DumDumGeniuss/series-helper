import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as seriesActions from '../../actions/series.js';

import ItemsBox from '../../components/box/ItemsBox/ItemsBox.jsx';
import SeriesModal from '../../components/modal/SeriesModal/SeriesModal.jsx';

class SeriesBoxContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showSeriesModal: false,
		};
	}
	componentDidMount() {
		const { actions } = this.props;
		actions.querySeries();
	}
	switchShowSeriesModal() {
		this.setState({
			showSeriesModal: !this.state.showSeriesModal,
		})
	}
	addSeries(newSeries) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items.push({
			title: newSeries.name,
			link: newSeries.link,
			status: 0,
			items: [],
		});
		actions.updateSeriesOptimistic(series.items);
	}
	updateSeriesOptimisticStatus(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].status = (series.items[index].status + 1) % 3;
		actions.updateSeriesOptimistic(series.items);
	}
	updateSeasonStatus(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].status = (series.items[index].items[seasonIndex].status + 1) % 3;
		actions.updateSeriesOptimistic(series.items);
	}
	updateEpStatus(index, seasonIndex, epIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items[epIndex].status = (series.items[index].items[seasonIndex].items[epIndex].status + 1) % 3;
		actions.updateSeriesOptimistic(series.items);
	}
	addSeason(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items.push({
			status: 0,
			items: [],
		});
		console.log(series);
		actions.updateSeriesOptimistic(series.items);
	}
	addEp(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items.push({
			status: 0,
		});
		actions.updateSeriesOptimistic(series.items);
	}
	deleteSeason(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items.splice(series.items[index].items.length - 1, 1);
		actions.updateSeriesOptimistic(series.items);
	}
	deleteEp(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items.splice(series.items[index].items[seasonIndex].items.length - 1, 1);
		actions.updateSeriesOptimistic(series.items);
	}
	render () {
		const self = this;
		const { series } = self.props.state;
		const { showSeriesModal } = self.state;
		const style = require('./SeriesBoxContainer.scss');
		return (
			<div className={style.itemsBoxContainer}>
				<div className={style.functionBar}>
					<span className={style.mainFuncIcon + ' ' + style.redGradient} onClick={self.switchShowSeriesModal.bind(self)}>
						<b>Add</b>
					</span>
					<span className={style.mainFuncIcon + ' ' + style.greenGradient}>
						<b>Save</b>
					</span>
					<SeriesModal
						showModal={showSeriesModal}
						switchShowFunc={self.switchShowSeriesModal.bind(self)}
						changeSeriesFunc={self.addSeries.bind(self)}
						title={'Create New Series'}
					/>
				</div>
				<div className={style.itemsContainer}>
					{
						series.items.map( (item, index) => {
							return (
								<div className={style.itemsArea}>
									<ItemsBox
										key={index}
										item={item}
										prewords={null}
										updateStatusFunc={self.updateSeriesOptimisticStatus.bind(self, index)}
										addItemFunc={self.addSeason.bind(self, index)}
										deleteItemFunc={self.deleteSeason.bind(self, index)}
									>
										{
											item.items.map( (item, seasonIndex) => {
												return (
													<ItemsBox
														key={seasonIndex}
														item={item}
														prewords={'Season'}
														order={seasonIndex}
														updateStatusFunc={self.updateSeasonStatus.bind(self, index, seasonIndex)}
														addItemFunc={self.addEp.bind(self, index, seasonIndex)}
														deleteItemFunc={self.deleteEp.bind(self, index, seasonIndex)}
													>
														{
															item.items.map( (item, epIndex) => {
																return (
																	<ItemsBox
																		key={epIndex}
																		item={item}
																		prewords={'EP'}
																		order={epIndex}
																		updateStatusFunc={self.updateEpStatus.bind(self, index, seasonIndex, epIndex)}
																	/>
																)
															})
														}
													</ItemsBox>
												)
											})
										}
									</ItemsBox>
								</div>
							)
						})
					}
				</div>
			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		state: state,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(seriesActions, dispatch),
	};
}

/**
* Connect Redux with this Component. (Container is on of the design pattern of React-Redux) 
*/
export default connect(mapStateToProps, mapDispatchToProps)(SeriesBoxContainer);

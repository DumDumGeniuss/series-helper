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
		const { user } = this.props.state;
		if(user.myProfile) {
			actions.querySeries(user.myProfile._id);
		}
	}
	switchShowSeriesModal() {
		this.setState({
			showSeriesModal: !this.state.showSeriesModal,
		})
	}
	resetSeries () {
		const { actions } = this.props;
		const { user } = this.props.state;
		actions.querySeries(user.myProfile._id);
	}
	addSeries(newSeries) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items.push({
			title: newSeries.name,
			link: newSeries.link,
			status: 0,
			items: [{
				status: 2,
				items: [{
					status: 2
				}]
			}]
		});
		actions.updateSeriesOptimistic(series);
	}
	deleteSeries(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items.splice(index, 1);
	}
	saveSeries() {
		const { actions } = this.props;
		const { series } = this.props.state;
		actions.updateSeries(series);
	}
	updateSeriesStatus(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].status = (series.items[index].status + 1) % 3;
		actions.updateSeriesOptimistic(series);
	}
	updateSeasonStatus(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].status = (series.items[index].items[seasonIndex].status + 1) % 3;
		actions.updateSeriesOptimistic(series);
	}
	updateEpStatus(index, seasonIndex, epIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items[epIndex].status = (series.items[index].items[seasonIndex].items[epIndex].status + 1) % 3;
		actions.updateSeriesOptimistic(series);
	}
	addSeason(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items.push({
			status: 2,
			items: [{
				status: 2
			}]
		});
		console.log(series);
		actions.updateSeriesOptimistic(series);
	}
	addEp(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items.push({
			status: 2
		});
		actions.updateSeriesOptimistic(series);
	}
	deleteSeason(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		if (series.items[index].items.length === 1) {
			return;
		}
		series.items[index].items.splice(series.items[index].items.length - 1, 1);
		actions.updateSeriesOptimistic(series);
	}
	deleteEp(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		if (series.items[index].items[seasonIndex].items.length === 1) {
			return;
		}
		series.items[index].items[seasonIndex].items.splice(series.items[index].items[seasonIndex].items.length - 1, 1);
		actions.updateSeriesOptimistic(series);
	}
	render () {
		const self = this;
		const { series, user } = self.props.state;
		const { showSeriesModal } = self.state;
		const style = require('./SeriesBoxContainer.scss');
		return (
			<div className={style.seriesBoxContainer}>
				<div style={ {'display': user.myProfile?'flex':'none'} } className={style.functionBar}>
					<span className={style.mainFuncIcon + ' ' + style.redGradient} onClick={self.switchShowSeriesModal.bind(self)}>
						<b>Add</b>
					</span>
					<span className={style.mainFuncIcon + ' ' + style.orangeGradient} onClick={self.saveSeries.bind(self)}>
						<b>Save</b>
					</span>
					<span className={style.mainFuncIcon + ' ' + style.greenGradient} onClick={self.resetSeries.bind(self)}>
						<b>Reset</b>
					</span>
					<SeriesModal
						showModal={showSeriesModal}
						switchShowFunc={self.switchShowSeriesModal.bind(self)}
						submitFunc={self.addSeries.bind(self)}
						title={'Create New Series'}
						params={['name', 'link']}
					/>
				</div>
				<div style={ {'display': user.myProfile?'flex':'none'} } className={style.seriesBox}>
					{
						series.items.map( (seriesItem, index) => {
							return (
								<div key={seriesItem.createDate} className={style.itemsArea}>
									<ItemsBox
										item={seriesItem}
										prewords={null}
										childNumberPrewords={'S'}
										childNumber={seriesItem.items.length}
										updateStatusFunc={self.updateSeriesStatus.bind(self, index)}
										addItemFunc={self.addSeason.bind(self, index)}
										deleteItemFunc={self.deleteSeason.bind(self, index)}
										displayStyle={'block'}
									>
										{
											seriesItem.items.map( (seasonItem, seasonIndex) => {
												return (
													<ItemsBox
														key={seasonIndex}
														item={seasonItem}
														prewords={'Season'}
														childNumberPrewords={'EP'}
														childNumber={seasonItem.items.length}
														order={seasonIndex}
														updateStatusFunc={self.updateSeasonStatus.bind(self, index, seasonIndex)}
														addItemFunc={self.addEp.bind(self, index, seasonIndex)}
														deleteItemFunc={self.deleteEp.bind(self, index, seasonIndex)}
														displayStyle={'block'}
													>
														{
															seasonItem.items.map( (epItem, epIndex) => {
																return (
																	<ItemsBox
																		key={epIndex}
																		item={epItem}
																		prewords={''}
																		order={epIndex}
																		updateStatusFunc={self.updateEpStatus.bind(self, index, seasonIndex, epIndex)}
																		displayStyle={'inline-flex'}
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

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as seriesActions from '../../actions/series.js';

import ItemsBox from '../../components/box/ItemsBox/ItemsBox.jsx';
import InputModal from '../../components/modal/InputModal/InputModal.jsx';

class SeriesBoxContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showInputModals: {
				showAddSeries: false,
				showEditSeries: false,
				showEditSeason: false,
			},
			editSeriesParams: {
				seriesIndex: 0,
				item: {}
			},
			editSeasonParams: {
				seriesIndex: 0,
				seasonIndex: 0,
				item: {}
			}
		};
	}
	componentDidMount() {
		const { actions } = this.props;
		const { user } = this.props.state;
		if(user.myProfile) {
			actions.querySeries(user.myProfile._id);
		}
	}
	switchInputModal(modal) {
		let { showInputModals } = this.state;
		showInputModals[modal] = !showInputModals[modal];
		this.setState({
			showInputModals: showInputModals,
		})
	}
	clickSereisEdit(modal, index, seriesItem) {
		let { editSeriesParams } = this.state;
		this.switchInputModal(modal);
		editSeriesParams.seriesIndex = index;
		editSeriesParams.item = {
			title: seriesItem.title,
			link: seriesItem.link
		};
		this.setState({
			editSeriesParams: editSeriesParams,
		})
	}
	clickSeasonEdit(modal, seriesIndex, seasonIndex, seasonItem) {
		let { editSeasonParams } = this.state;
		this.switchInputModal(modal);
		editSeasonParams.seriesIndex = seriesIndex;
		editSeasonParams.seasonIndex = seasonIndex;
		editSeasonParams.item = {
			link: seasonItem.link
		};
		console.log(editSeasonParams);
		this.setState({
			editSeasonParams: editSeasonParams,
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
			title: newSeries.title,
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
	updateSeries(newSeries) {
		const { actions } = this.props;
		const { series } = this.props.state;
		const { editSeriesParams } = this.state;
		const { seriesIndex } = editSeriesParams;
		for (let key in newSeries) {
			series.items[seriesIndex][key] = newSeries[key];
		}
		actions.updateSeriesOptimistic(series);
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
		actions.updateSeriesOptimistic(series);
	}
	updateSeason(newSeason) {
		const { actions } = this.props;
		const { series } = this.props.state;
		const { editSeasonParams } = this.state;
		const { seriesIndex, seasonIndex } = editSeasonParams;
		for (let key in newSeason) {
			series.items[seriesIndex].items[seasonIndex][key] = newSeason[key];
		}
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
		const { showInputModals, editSeriesParams, editSeasonParams } = self.state;
		const style = require('./SeriesBoxContainer.scss');
		console.log(editSeriesParams.item);
		return (
			<div className={style.seriesBoxContainer}>
				<InputModal
					showModal={showInputModals.showAddSeries}
					switchShowFunc={self.switchInputModal.bind(self, 'showAddSeries')}
					submitFunc={self.addSeries.bind(self)}
					title={'Create New Series'}
					params={[{title: 'title', value: 'input title'}, {title: 'link', value: 'input link'}]}
					elementId={'addSeriesModal'}
				/>
				<InputModal
					showModal={showInputModals.showEditSeries}
					switchShowFunc={self.switchInputModal.bind(self, 'showEditSeries')}
					submitFunc={self.updateSeries.bind(self)}
					title={'Edit Series'}
					params={[{title: 'title', value: editSeriesParams.item.title}, {title: 'link', value: editSeriesParams.item.link}]}
					elementId={'editSeriesModal'}
				/>
				<InputModal
					showModal={showInputModals.showEditSeason}
					switchShowFunc={self.switchInputModal.bind(self, 'showEditSeason')}
					submitFunc={self.updateSeason.bind(self)}
					title={'Edit Season'}
					params={[{title: 'link', value: editSeasonParams.item.link}]}
					elementId={'editSeasonModal'}
				/>
				<div style={ {'display': user.myProfile?'flex':'none'} } className={style.functionBar}>
					<span className={style.mainFuncIcon + ' ' + style.redGradient} onClick={self.switchInputModal.bind(self, 'showAddSeries')}>
						<b>Add</b>
					</span>
					<span className={style.mainFuncIcon + ' ' + style.orangeGradient} onClick={self.saveSeries.bind(self)}>
						<b>Save</b>
					</span>
					<span className={style.mainFuncIcon + ' ' + style.greenGradient} onClick={self.resetSeries.bind(self)}>
						<b>Reset</b>
					</span>
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
										clickEditFunc={self.clickSereisEdit.bind(self, 'showEditSeries', index, seriesItem)}
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
														clickEditFunc={self.clickSeasonEdit.bind(self, 'showEditSeason', index, seasonIndex, seriesItem)}
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

import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as seriesActions from '../../actions/series.js';

import ItemsBox from '../../components/box/ItemsBox/ItemsBox.jsx';
import InputModal from '../../components/modal/InputModal/InputModal.jsx';
import DialogModal from '../../components/modal/DialogModal/DialogModal.jsx';

import fb from '../../apis/fb.js';
import * as userApi from '../../apis/user.js';

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
			},
			showDialogModals: {
				showSaveSeries: false,
			},
			seriesOwnerProfile: null
		};
		this.getSeries = this.getSeries.bind(this);
	}
	componentDidMount() {
		const self = this;
		if (!IS_FB_API_LOADED) {
			document.addEventListener("fb-api-loaded", function(e) {
				self.getSeries();
			});
		} else {
			self.getSeries();
		}
	}
	componentWillReceiveProps(nextProps) {
		const { actions, params } = this.props;
		const { series } = nextProps.state;]
		if(!series._id) {
			this.getSeries();
		}
	}
	switchInputModal(modal) {
		let { showInputModals } = this.state;
		showInputModals[modal] = !showInputModals[modal];
		this.setState({
			showInputModals: showInputModals,
		});
	}
	switchDialogModal(modal) {
		let { showDialogModals } = this.state;
		showDialogModals[modal] = !showDialogModals[modal];
		this.setState({
			showDialogModals: showDialogModals,
		});
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
		});
	}
	clickSeasonEdit(modal, seriesIndex, seasonIndex, seasonItem) {
		let { editSeasonParams } = this.state;
		this.switchInputModal(modal);
		editSeasonParams.seriesIndex = seriesIndex;
		editSeasonParams.seasonIndex = seasonIndex;
		editSeasonParams.item = {
			link: seasonItem.link
		};
		this.setState({
			editSeasonParams: editSeasonParams,
		});
	}
	getSeries() {
		const self = this;
		const { actions, params } = self.props;

		fb.checkLogin()
			.then((res) => {
				let isLogin = res.status==='connected'?true:false;
				if (!isLogin && !params.userId) {
					throw new Error('You must log in');
				} else if (isLogin && !params.userId) {
					return userApi.getUser(res.authResponse.userID);
				} else {
					return userApi.getUser(params.userId);
				}
			})
			.then((res) => {
				self.setState({
					seriesOwnerProfile: res
				});
				actions.querySeries(res._id);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	addSeries(newSeries) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items.push({
			title: newSeries.title,
			link: newSeries.link,
			_id: this.generateId(),
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
	saveSeries() {
		const { actions } = this.props;
		const { series, user } = this.props.state;
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
	resetSeries () {
		const { actions } = this.props;
		const { series, user } = this.props.state;
		fb.checkLogin()
			.then((res) => {
				if (res.status !== 'connected')  {
					throw new Error('You are not logged in');
				}
				if (user.myProfile._id !== series._id) {
					throw new Error('You don\'s have right to reset this series');
				}
				actions.querySeries(user.myProfile._id);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	deleteSeries(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items.splice(index, 1);
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
	updateSeasonStatus(index, seasonIndex) {
		fb.getMyProfile();
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].status = (series.items[index].items[seasonIndex].status + 1) % 3;
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
	addEp(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items.push({
			status: 2
		});
		actions.updateSeriesOptimistic(series);
	}
	updateEpStatus(index, seasonIndex, epIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items[epIndex].status = (series.items[index].items[seasonIndex].items[epIndex].status + 1) % 3;
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
	generateId() {
		let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
		return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
			return (Math.random() * 16 | 0).toString(16);
		}).toLowerCase();
	}
	render () {
		const self = this;
		const { series, user } = self.props.state;
		const { seriesOwnerProfile, showInputModals, editSeriesParams, editSeasonParams, showDialogModals } = self.state;
		const style = require('./SeriesBoxContainer.scss');
		const seriesHelper = require('./SeriesHelper.png');
		const currentUserId = user.myProfile?user.myProfile._id:'';
		const [seriesOwnerId, seriesOwnerName, seriesOwnerPicture] = seriesOwnerProfile?[seriesOwnerProfile._id, seriesOwnerProfile.name, seriesOwnerProfile.picture]:[];
		const seriesTitleFont = seriesOwnerName?(seriesOwnerName + '\'s Series'):'';
		const seriesOwnerPictureElement = seriesOwnerPicture?<img src={seriesOwnerPicture} />:null;
		const hasEditRight = currentUserId===seriesOwnerId?true:false;

		return (
			<div className={style.outsider}>
				<div className={style.seriesBoxContainer}>
					<figure>
						{seriesOwnerPictureElement}
					</figure>
					<h1 className={style.h1Title}>
						{seriesTitleFont}
					</h1>
					<div className={currentUserId===seriesOwnerId?'':style.invisible}>
						<div className={style.functionBar}>
							<span className={style.mainFuncIcon + ' ' + style.redGradient} onClick={self.switchInputModal.bind(self, 'showAddSeries')}>
								<b>Add</b>
							</span>
							<span className={style.mainFuncIcon + ' ' + style.orangeGradient} onClick={self.switchDialogModal.bind(self, 'showSaveSeries')}>
								<b>Save</b>
							</span>
							<span className={style.mainFuncIcon + ' ' + style.greenGradient} onClick={self.resetSeries.bind(self)}>
								<b>Reset</b>
							</span>
						</div>
					</div>
					<div className={style.seriesBox}>
						{
							series.items.map( (seriesItem, index) => {
								return (
									<div key={seriesItem._id} className={style.itemsArea}>
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
											editable={hasEditRight}
										>
											{
												seriesItem.items.map( (seasonItem, seasonIndex) => {
													return (
														<ItemsBox
															key={seriesItem._id + seasonIndex}
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
															editable={hasEditRight}
														>
															{
																seasonItem.items.map( (epItem, epIndex) => {
																	return (
																		<ItemsBox
																			key={seriesItem._id + seasonIndex + epIndex}
																			item={epItem}
																			prewords={''}
																			order={epIndex}
																			updateStatusFunc={self.updateEpStatus.bind(self, index, seasonIndex, epIndex)}
																			displayStyle={'inline-flex'}
																			editable={hasEditRight}
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
					<DialogModal
						showModal={showDialogModals.showSaveSeries}
						switchShowFunc={self.switchDialogModal.bind(self, 'showSaveSeries')}
						submitFunc={self.saveSeries.bind(self)}
						title={'Do you want to save?'}
						elementId={'showSaveSeriesDialog'}
					/>
					<InputModal
						showModal={showInputModals.showAddSeries}
						switchShowFunc={self.switchInputModal.bind(self, 'showAddSeries')}
						submitFunc={self.addSeries.bind(self)}
						title={'Create New Series'}
						params={[{title: 'title', value: ''}, {title: 'link', value: ''}]}
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

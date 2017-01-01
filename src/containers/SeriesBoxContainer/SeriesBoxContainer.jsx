import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as seriesActions from '../../actions/series.js';

import ItemsBox from '../../components/box/ItemsBox/ItemsBox.jsx';
import InputModal from '../../components/modal/InputModal/InputModal.jsx';
import DialogModal from '../../components/modal/DialogModal/DialogModal.jsx';
import LoginButtonContainer from '../../containers/LoginButtonContainer/LoginButtonContainer.jsx';

import fb from '../../apis/fb.js';
import * as userApi from '../../apis/user.js';
import * as seriesApi from '../../apis/series.js';

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
				canNotUpdateStatus: false,
			},
			seriesOwnerProfile: null,
			series: {
				_id: '',
				public: false,
				items: []
			}
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
		const { params } = this.props;
		const { user } = nextProps.state;
		const { series, seriesOwnerProfile } = this.state;
		if ( (!params.userId) && (!user.myProfile) ) {
			this.setState({
				series: {
					_id: '',
					items: [],
					public: false
				},
				seriesOwnerProfile: null
			})
			return;
		}
		this.getSeries();
	}
	cloneJsonItem(item) {
		return JSON.parse(JSON.stringify(item));
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
		const { params } = self.props;

		fb.checkLogin()
			.then((res) => {
				let isLogin = res.status==='connected'?true:false;
				if (!isLogin && !params.userId) {
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
				return seriesApi.getSeries(res._id);
			})
			.then((res) => {
				res.items = JSON.parse(res.items);
				this.setState({
					series: res
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	addSeries(series, newSeries) {
		series = this.cloneJsonItem(series);
		series.items.push({
			title: newSeries.title,
			link: newSeries.link,
			_id: this.generateId(),
			status: 1,
			items: [{
				status: 1,
				items: [{
					status: 1
				}]
			}]
		});
		this.setState({
			series: series
		})
	}
	saveSeries(series) {
		const self = this;
		series = this.cloneJsonItem(series);
		series.items = JSON.stringify(series.items);
		seriesApi.updateSeries(series)
			.then((res) => {
				res.items = JSON.parse(res.items);
				self.setState({
					series: res
				});
			});
	}
	updateSeries(series,  newSeries) {
		series = this.cloneJsonItem(series);
		const { editSeriesParams } = this.state;
		const { seriesIndex } = editSeriesParams;
		for (let key in newSeries) {
			series.items[seriesIndex][key] = newSeries[key];
		}
		this.setState({
			series: series
		})
	}
	updateSeriesStatus(series, index) {
		series = this.cloneJsonItem(series);
		const currentLastSeasonIndex = series.items[index].items.length - 1;
		const currentLastSeason = series.items[index].items[currentLastSeasonIndex];

		series.items[index].status = (series.items[index].status + 1) % 2;

		if (currentLastSeason.status !==series.items[index].status) {
			this.updateSeasonStatus(series, index, currentLastSeasonIndex);
		} else {
			this.setState({
				series: series
			})
		}
	}
	resetSeries () {
		const self = this;
		const { series } = self.state;
		const { user } = self.props.state;
		fb.checkLogin()
			.then((res) => {
				if (res.status !== 'connected')  {
					throw new Error('You are not logged in');
				}
				if (user.myProfile._id !== series._id) {
					throw new Error('You don\'s have right to reset this series');
				}
				seriesApi.getSeries(series._id)
					.then((res) => {
						res.items = JSON.parse(res.items);
						self.setState({
							series: res
						});
					});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	addSeason(series, index) {
		series = this.cloneJsonItem(series);
		const currentLastSeasonIndex = series.items[index].items.length - 1;
		const currentLastSeason = series.items[index].items[currentLastSeasonIndex];
		series.items[index].items.push({
			status: 1,
			items: [{
				status: 1
			}]
		});
		if (series.items[index].status === 0) {
			series.items[index].status = 1;
		} 

		if (currentLastSeason.status === 1) {
			this.updateSeasonStatus(series, index, currentLastSeasonIndex);
		} else {
			this.setState({
				series: series
			})
		}
	}
	updateSeason(series, newSeason) {
		series = this.cloneJsonItem(series);
		const { editSeasonParams } = this.state;
		const { seriesIndex, seasonIndex } = editSeasonParams;
		for (let key in newSeason) {
			series.items[seriesIndex].items[seasonIndex][key] = newSeason[key];
		}
		this.setState({
			series: series
		})
	}
	updateSeasonStatus(series, index, seasonIndex, newStatus) {
		series = this.cloneJsonItem(series);
		const { showDialogModals } = this.state;
		const currentLastSeasonIndex = series.items[index].items.length - 1;
		const currentLastSeason = series.items[index].items[currentLastSeasonIndex];
		const targetSeason = series.items[index].items[seasonIndex];
		const currentLastEpIndex = series.items[index].items[seasonIndex].items.length - 1;
		const currentLastEp = series.items[index].items[seasonIndex].items[currentLastEpIndex];
		targetSeason.status = (targetSeason.status + 1) % 2;

		if (currentLastSeason.status !== series.items[index].status) {
			series.items[index].status = currentLastSeason.status;
		} 

		if (currentLastSeasonIndex !== seasonIndex && targetSeason.status !==0) {
			showDialogModals.canNotUpdateStatus = true;
			this.setState({
				showDialogModals: showDialogModals
			});
		} else if (targetSeason.status !== currentLastEp.status) {
			this.updateEpStatus(series, index, seasonIndex, currentLastEpIndex, targetSeason.status);
		} else {
			this.setState({
				series: series
			})
		}
	}
	deleteSeason(series, index) {
		series = this.cloneJsonItem(series);
		if (series.items[index].items.length === 1) {
			return;
		}
		series.items[index].items.splice(series.items[index].items.length - 1, 1);

		if (series.items[index].status === 1) {
			series.items[index].status = 0;
			this.setState({
				series: series
			})
		} else {
			this.setState({
				series: series
			})
		}
	}
	addEp(series, index, seasonIndex, newStatus) {
		series = this.cloneJsonItem(series);
		const targetSeason = series.items[index].items[seasonIndex];
		const currentLastEpIndex = targetSeason.items.length - 1;
		const currentLastSeasonIndex = series.items[index].items.length - 1;
		series.items[index].items[seasonIndex].items[currentLastEpIndex].status = 0;
		if (targetSeason.status === 0) {
			if (currentLastSeasonIndex !== seasonIndex) {
				series.items[index].items[seasonIndex].items.push({
					status: 0
				});
				this.setState({
					series: series
				})
			} else {
				series.items[index].items[seasonIndex].items.push({
					status: 1
				});
				this.updateSeasonStatus(series, index, seasonIndex);
			}
		} else {
			series.items[index].items[seasonIndex].items.push({
				status: 1
			});
			this.setState({
				series: series
			})
		}
	}
	updateEpStatus(series, index, seasonIndex, epIndex, newStatus) {
		series = this.cloneJsonItem(series);
		let targetSeason = series.items[index].items[seasonIndex];
		const targetEp = targetSeason.items[epIndex];
		targetEp.status = (targetEp.status + 1) % 2;
		if (epIndex !== targetSeason.items.length -1) {
		} else {
			if (targetSeason.status !== targetEp.status) {
				this.updateSeasonStatus(series, index, seasonIndex);
			} else {
				this.setState({
					series: series
				})
			}
		}
	}
	deleteEp(series, index, seasonIndex) {
		series = this.cloneJsonItem(series);
		let targetSeason = series.items[index].items[seasonIndex];

		if (series.items[index].items[seasonIndex].items.length === 1) {
			return;
		}
		series.items[index].items[seasonIndex].items.splice(series.items[index].items[seasonIndex].items.length - 1, 1);

		if (targetSeason.status === 1) {
			this.updateSeasonStatus(series, index, seasonIndex);
		} else {
			this.setState({
				series: series
			})
		}
	}
	generateId() {
		let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
		return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
			return (Math.random() * 16 | 0).toString(16);
		}).toLowerCase();
	}
	render () {
		const self = this;
		let { user } = self.props.state;
		const { series, seriesOwnerProfile, showInputModals, editSeriesParams, editSeasonParams, showDialogModals } = self.state;
		const style = require('./SeriesBoxContainer.scss');
		const seriesHelper = require('./SeriesHelper.png');
		const currentUserId = user.myProfile?user.myProfile._id:'';
		const [seriesOwnerId, seriesOwnerName, seriesOwnerPicture] = seriesOwnerProfile?[seriesOwnerProfile._id, seriesOwnerProfile.name, seriesOwnerProfile.picture]:[];
		const seriesTitleFont = seriesOwnerName?(seriesOwnerName + '\'s Series'):'';
		const seriesOwnerPictureElement = seriesOwnerPicture?<img src={seriesOwnerPicture} />:null;
		const hasEditRight = currentUserId===seriesOwnerId?true:false;
		// console.log(series);

		return (
			<div className={style.outsider}>
				<div className={series._id?style.invisible:style.pleasLoginContainer}>
					<div className={style.loginMessage}>請登入以繼續</div>
				</div>
				<div className={series._id?style.seriesBoxContainer:style.invisible}>
					<figure>
						{seriesOwnerPictureElement}
					</figure>
					<h1 className={style.h1Title}>
						{seriesTitleFont}
					</h1>
					<div className={currentUserId===seriesOwnerId?'':style.invisible}>
						<div className={style.functionBar}>
							<span className={style.mainFuncIcon + ' ' + style.redGradient} onClick={self.switchInputModal.bind(self, 'showAddSeries')}>
								<b>新增項目</b>
							</span>
							<span className={style.mainFuncIcon + ' ' + style.orangeGradient} onClick={self.switchDialogModal.bind(self, 'showSaveSeries')}>
								<b>儲存</b>
							</span>
							<span className={style.mainFuncIcon + ' ' + style.greenGradient} onClick={self.resetSeries.bind(self)}>
								<b>重置</b>
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
											updateStatusFunc={self.updateSeriesStatus.bind(self, series, index)}
											addItemFunc={self.addSeason.bind(self, series, index)}
											deleteItemFunc={self.deleteSeason.bind(self, series, index)}
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
															updateStatusFunc={self.updateSeasonStatus.bind(self, series, index, seasonIndex)}
															addItemFunc={self.addEp.bind(self, series, index, seasonIndex)}
															deleteItemFunc={self.deleteEp.bind(self, series, index, seasonIndex)}
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
																			updateStatusFunc={self.updateEpStatus.bind(self, series, index, seasonIndex, epIndex)}
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
						submitFunc={self.saveSeries.bind(self, series)}
						title={'您確定要儲存嗎?'}
						elementId={'showSaveSeriesDialog'}
					/>
					<DialogModal
						showModal={showDialogModals.canNotUpdateStatus}
						switchShowFunc={self.switchDialogModal.bind(self, 'canNotUpdateStatus')}
						submitFunc={self.saveSeries.bind(self, series)}
						title={'因為您已經更新的一季在追蹤，因此無法更動此季狀態'}
						elementId={'canNotUpdateStatusDialog'}
					/>
					<InputModal
						showModal={showInputModals.showAddSeries}
						switchShowFunc={self.switchInputModal.bind(self, 'showAddSeries')}
						submitFunc={self.addSeries.bind(self, series)}
						title={'新增影集'}
						params={[{title: 'title', value: ''}, {title: 'link', value: ''}]}
						elementId={'addSeriesModal'}
					/>
					<InputModal
						showModal={showInputModals.showEditSeries}
						switchShowFunc={self.switchInputModal.bind(self, 'showEditSeries')}
						submitFunc={self.updateSeries.bind(self, series)}
						title={'編輯影集資訊'}
						params={[{title: 'title', value: editSeriesParams.item.title}, {title: 'link', value: editSeriesParams.item.link}]}
						elementId={'editSeriesModal'}
					/>
					<InputModal
						showModal={showInputModals.showEditSeason}
						switchShowFunc={self.switchInputModal.bind(self, 'showEditSeason')}
						submitFunc={self.updateSeason.bind(self, series)}
						title={'編輯該季資訊'}
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

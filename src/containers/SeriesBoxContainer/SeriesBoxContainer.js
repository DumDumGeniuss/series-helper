import React from 'react';

import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
// import { bindActionCreators } from 'redux';
// import * as seriesActions from '../../actions/series.js';

import ItemsBox from '../../components/box/ItemsBox/ItemsBox.js';
import InputModal from '../../components/modal/InputModal/InputModal.js';
import NumberInputModal from '../../components/modal/NumberInputModal/NumberInputModal.js';
import DialogModal from '../../components/modal/DialogModal/DialogModal.js';
import LoginButtonContainer from '../../containers/LoginButtonContainer/LoginButtonContainer.js';
import LoadingBox from '../../components/box/LoadingBox/LoadingBox.js';

import fb from '../../apis/fb.js';
import * as userApi from '../../apis/user.js';
import * as seriesApi from '../../apis/series.js';

class SeriesBoxContainer extends React.Component {
	static get propTypes() {
		return {
			params: React.PropTypes.object,
		};
	}
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
				item: {},
			},
			editSeasonParams: {
				seriesIndex: 0,
				seasonIndex: 0,
				item: {},
			},
			editEpNumberParams: {
				seriesIndex: 0,
				seasonIndex: 0,
			},
			showDialogModals: {
				showSaveSeries: false,
				canNotUpdateStatus: false,
			},
			showNumberInputModals: {
				showEpNumberInput: false,
			},
			seriesOwnerProfile: null,
			/* This is the most important state of this container, it's very complicated */
			series: {
				_id: '',
				public: false,
				items: [],
			},
			isLoading: false,
			isSaving: false,
			isResetting: false,
			statusFiltered: null,
		};
		this.getSeries = this.getSeries.bind(this);
	}
	componentDidMount() {
		const self = this;
		if (!IS_FB_API_LOADED) {
			document.addEventListener('fb-api-loaded', () => {
				self.getSeries();
			});
		} else {
			self.getSeries();
		}
	}
	componentWillReceiveProps(nextProps) {
		const { params } = this.props;
		const { user } = nextProps.state;
		if ( (!params.userId) && (!user.myProfile) ) {
			this.setState({
				series: {
					_id: '',
					items: [],
					public: false,
				},
				seriesOwnerProfile: null,
			});
			return;
		}
		this.getSeries();
	}
	getSeries() {
		const self = this;
		const { params } = self.props;

		fb.checkLogin()
			.then((res) => {
				const isLogin = res.status === 'connected' ? true : false;

				if (!isLogin && !params.userId) {
					console.log('No login and no userId found');
				} else if (isLogin && !params.userId) {
					this.setState({
						isLoading: true,
					});
					return userApi.getUser(res.authResponse.userID);
				} else {
					this.setState({
						isLoading: true,
					});
					return userApi.getUser(params.userId);
				}
			})
			.then((res) => {
				self.setState({
					seriesOwnerProfile: res,
				});
				return seriesApi.getSeries(res._id);
			})
			.then((res) => {
				// res.items = JSON.parse(res.items);
				this.setState({
					series: res,
					isLoading: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	switchInputModal(modal) {
		const { showInputModals } = this.state;
		showInputModals[modal] = !showInputModals[modal];
		this.setState({
			showInputModals: showInputModals,
		});
	}
	switchDialogModal(modal) {
		const { showDialogModals } = this.state;
		showDialogModals[modal] = !showDialogModals[modal];
		this.setState({
			showDialogModals: showDialogModals,
		});
	}
	clickSereisEdit(modal, index, seriesItem) {
		const { editSeriesParams } = this.state;
		this.switchInputModal(modal);
		editSeriesParams.seriesIndex = index;
		editSeriesParams.item = {
			title: seriesItem.title,
			link: seriesItem.link,
		};
		this.setState({
			editSeriesParams: editSeriesParams,
		});
	}
	clickSeasonEdit(modal, seriesIndex, seasonIndex, seasonItem) {
		const { editSeasonParams } = this.state;
		this.switchInputModal(modal);
		editSeasonParams.seriesIndex = seriesIndex;
		editSeasonParams.seasonIndex = seasonIndex;
		editSeasonParams.item = {
			link: seasonItem.link,
			title: seasonItem.title,
		};
		this.setState({
			editSeasonParams: editSeasonParams,
		});
	}
	clickInputEpNumber(modal, seriesIndex, seasonIndex) {
		const { editEpNumberParams } = this.state;
		this.switchNumberInputModal(modal);
		editEpNumberParams.seriesIndex = seriesIndex;
		editEpNumberParams.seasonIndex = seasonIndex;
	}
	switchNumberInputModal(modal) {
		const { showNumberInputModals } = this.state;
		showNumberInputModals[modal] = !showNumberInputModals[modal];
		this.setState({
			showNumberInputModals: showNumberInputModals,
		});
	}
	filterStatus(status) {
		this.setState({
			statusFiltered: status,
		});
	}
	cloneJsonItem(item) {
		return JSON.parse(JSON.stringify(item));
	}
	addSeries(newSeries) {
		const series = this.cloneJsonItem(this.state.series);
		series.items.push({
			title: newSeries.title,
			link: newSeries.link,
			_id: this.generateId(),
			status: 1,
			items: [{
				status: 1,
				episodeNumber: 1,
				link: '',
				title: 'Season 1',
			}],
		});
		this.setState({
			series: series,
		});
	}
	saveSeries() {
		const self = this;
		const series = self.cloneJsonItem(self.state.series);
		// series.items = JSON.stringify(series.items);
		self.setState({
			isSaving: true,
		});
		seriesApi.updateSeries(series)
			.then((res) => {
				if (res.status === 401) {
					throw new Error('您的登入期限已經過期，或是您沒有權限操作此筆資料');
				}
				return res.json();
			})
			.then((res) => {
				// res.items = JSON.parse(res.items);
				self.setState({
					series: res,
					isSaving: false,
				});
			})
			.catch((err) => {
				alert(err.message);
				browserHistory.push('/');
			});
	}
	updateSeries(newSeries) {
		const series = this.cloneJsonItem(this.state.series);
		const { editSeriesParams } = this.state;
		const { seriesIndex } = editSeriesParams;
		for (const key in newSeries) {
			if (key) {
				series.items[seriesIndex][key] = newSeries[key];
			}
		}
		this.setState({
			series: series,
		});
	}
	updateSeriesStatus(newSeries, index) {
		const series = newSeries ? newSeries : this.cloneJsonItem(this.state.series);
		const currentLastSeasonIndex = series.items[index].items.length - 1;
		const currentLastSeason = series.items[index].items[currentLastSeasonIndex];

		series.items[index].status = (series.items[index].status + 1) % 2;

		if (currentLastSeason.status !== series.items[index].status) {
			this.updateSeasonStatus(series, index, currentLastSeasonIndex);
		} else {
			this.setState({
				series: series,
			});
		}
	}
	deleteSeries(index) {
		const series = this.cloneJsonItem(this.state.series);
		series.items.splice(index, 1);
		this.setState({
			series: series,
		});
	}
	resetSeries() {
		const self = this;
		const { series } = self.state;
		self.setState({
			isResetting: true,
		});
		seriesApi.getSeries(series._id)
			.then((res) => {
				// res.items = JSON.parse(res.items);
				self.setState({
					series: res,
					isResetting: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	addSeason(index) {
		const series = this.cloneJsonItem(this.state.series);
		const currentLastSeasonIndex = series.items[index].items.length - 1;
		const currentLastSeason = series.items[index].items[currentLastSeasonIndex];
		series.items[index].items.push({
			status: 1,
			episodeNumber: 1,
			link: '',
			title: 'Season ' + (currentLastSeasonIndex + 2),
		});
		if (series.items[index].status === 0) {
			series.items[index].status = 1;
		}

		if (currentLastSeason.status === 1) {
			this.updateSeasonStatus(series, index, currentLastSeasonIndex);
		} else {
			this.setState({
				series: series,
			});
		}
	}
	updateSeason(newSeason) {
		const series = this.cloneJsonItem(this.state.series);
		const { editSeasonParams } = this.state;
		const { seriesIndex, seasonIndex } = editSeasonParams;
		for (const key in newSeason) {
			if (key) {
				series.items[seriesIndex].items[seasonIndex][key] = newSeason[key];
			}
		}
		this.setState({
			series: series,
		});
	}
	updateSeasonStatus(newSeries, index, seasonIndex) {
		const series = newSeries ? newSeries : this.cloneJsonItem(this.state.series);
		const { showDialogModals } = this.state;
		const currentLastSeasonIndex = series.items[index].items.length - 1;
		const currentLastSeason = series.items[index].items[currentLastSeasonIndex];
		const targetSeason = series.items[index].items[seasonIndex];
		targetSeason.status = (targetSeason.status + 1) % 2;

		if (currentLastSeason.status !== series.items[index].status) {
			series.items[index].status = currentLastSeason.status;
		}

		if (currentLastSeasonIndex !== seasonIndex && targetSeason.status !== 0) {
			showDialogModals.canNotUpdateStatus = true;
			this.setState({
				showDialogModals: showDialogModals,
			});
		} else {
			this.setState({
				series: series,
			});
		}
	}
	deleteSeason(index) {
		const series = this.cloneJsonItem(this.state.series);
		if (series.items[index].items.length === 1) {
			return;
		}
		series.items[index].items.splice(series.items[index].items.length - 1, 1);

		if (series.items[index].status === 1) {
			series.items[index].status = 0;
			this.setState({
				series: series,
			});
		} else {
			this.setState({
				series: series,
			});
		}
	}
	addEp(index, seasonIndex, counts) {
		const series = this.cloneJsonItem(this.state.series);
		const targetSeason = series.items[index].items[seasonIndex];
		targetSeason.episodeNumber = (typeof counts === 'number') ? counts : (targetSeason.episodeNumber + 1);
		this.setState({
			series: series,
		});
	}
	deleteEp(index, seasonIndex) {
		const series = this.cloneJsonItem(this.state.series);
		const targetSeason = series.items[index].items[seasonIndex];

		if (targetSeason.episodeNumber === 1) {
			return;
		}

		targetSeason.episodeNumber -= 1;
		this.setState({
			series: series,
		});
	}
	generateId() {
		const timestamp = (new Date().getTime() / 1000 | 0).toString(4);
		return timestamp + 'xxxx'.replace(/[x]/g, () => {
			return (Math.random() * 16 | 0).toString(16);
		}).toLowerCase();
	}
	render() {
		const self = this;
		const { user } = self.props.state;
		const { isLoading, isSaving, isResetting, series,
			seriesOwnerProfile, showInputModals, showNumberInputModals,
			editSeriesParams, editSeasonParams, editEpNumberParams,
			showDialogModals, statusFiltered } = self.state;
		const style = require('./SeriesBoxContainer.scss');
		const currentUserId = user.myProfile ? user.myProfile._id : '';
		const [seriesOwnerId, seriesOwnerName, seriesOwnerPicture] = seriesOwnerProfile ? [seriesOwnerProfile._id, seriesOwnerProfile.name, seriesOwnerProfile.picture] : [];
		const hasEditRight = currentUserId === seriesOwnerId ? true : false;


		/* You must notice lots of function pass null as the parameter of series, this is because those functions
		might be a chain, it linked one after another, and in the first layer, just null.  */
		return (
			<div className={style.outsider}>
				<div className={series._id ? style.invisible : style.pleasLoginContainer}>
					<div className={isLoading ? style.invisible : style.loginMessage}><LoginButtonContainer /></div>
					<LoadingBox boxWidth={35} boxHeight={35} visible={isLoading} color={'#024e80'}/>
				</div>
				<div className={series._id ? style.seriesBoxContainer : style.invisible}>
					<div className={style.statusFilterBox}>
						<div className={statusFiltered === 0 ? (style.statusFilterButtonPicked + ' ' + style.greenGradient) : (style.statusFilterButton + ' ' + style.greenGradient)} onClick={this.filterStatus.bind(this, 0)}>完</div>
						<div className={statusFiltered === 1 ? (style.statusFilterButtonPicked + ' ' + style.orangeGradient) : (style.statusFilterButton + ' ' + style.orangeGradient)} onClick={this.filterStatus.bind(this, 1)}>追</div>
						<div className={statusFiltered === null ? (style.statusFilterButtonPicked + ' ' + style.redGradient) : (style.statusFilterButton + ' ' + style.redGradient)} onClick={this.filterStatus.bind(this, null)}>全</div>
					</div>
					<figure>
						{seriesOwnerPicture ? <img src={seriesOwnerPicture} /> : null}
					</figure>
					<h1 className={style.h1Title}>
						{seriesOwnerName ? (seriesOwnerName + ' 的追劇進度') : ''}
					</h1>
					<div className={hasEditRight ? '' : style.invisible}>
						<div className={style.functionBar}>
							<span className={style.mainFuncIcon + ' ' + style.redGradient} onClick={self.switchInputModal.bind(self, 'showAddSeries')}>
								<b>新增影集</b>
							</span>
							<span className={style.mainFuncIcon + ' ' + style.orangeGradient} onClick={self.switchDialogModal.bind(self, 'showSaveSeries')}>
								<b className={isSaving ? style.invisible : ''}>儲存</b>
								<LoadingBox boxWidth={35} boxHeight={35} visible={isSaving} color={'white'}/>
							</span>
							<span className={style.mainFuncIcon + ' ' + style.greenGradient} onClick={self.resetSeries.bind(self)}>
								<b className={isResetting ? style.invisible : ''}>重置</b>
								<LoadingBox boxWidth={35} boxHeight={35} visible={isResetting} color={'white'}/>
							</span>
						</div>
					</div>
					<div className={style.seriesBox}>
						{
							series.items.map( (seriesItem, index) => {
								return (
									<div key={seriesItem._id} className={(statusFiltered === null || statusFiltered === seriesItem.status) ? style.itemsArea : style.invisible}>
										<ItemsBox
											item={seriesItem}
											prewords={null}
											childNumberPrewords={'season'}
											childNumber={seriesItem.items.length}
											updateStatusFunc={self.updateSeriesStatus.bind(self, null, index)}
											addItemFunc={self.addSeason.bind(self, index)}
											deleteItemFunc={self.deleteSeason.bind(self, index)}
											deleteSelfFunc={self.deleteSeries.bind(self, index)}
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
															prewords={null}
															childNumberPrewords={'ep '}
															childNumber={seasonItem.episodeNumber}
															updateStatusFunc={self.updateSeasonStatus.bind(self, null, index, seasonIndex)}
															addItemFunc={self.addEp.bind(self, index, seasonIndex)}
															deleteItemFunc={self.deleteEp.bind(self, index, seasonIndex)}
															clickEditFunc={self.clickSeasonEdit.bind(self, 'showEditSeason', index, seasonIndex, seasonItem)}
															clickInputNumberFunc={self.clickInputEpNumber.bind(self, 'showEpNumberInput', index, seasonIndex)}
															displayStyle={'block'}
															editable={hasEditRight}
														/>
													);
												})
											}
										</ItemsBox>
									</div>
								);
							})
						}
					</div>
					<NumberInputModal
						showModal={showNumberInputModals.showEpNumberInput}
						switchShowFunc={self.switchNumberInputModal.bind(self, 'showEpNumberInput')}
						submitFunc={self.addEp.bind(self, editEpNumberParams.seriesIndex, editEpNumberParams.seasonIndex)}
						elementId={'epNumberInputModal'}
						defaultValue={'1'}
					/>
					<DialogModal
						showModal={showDialogModals.showSaveSeries}
						switchShowFunc={self.switchDialogModal.bind(self, 'showSaveSeries')}
						submitFunc={self.saveSeries.bind(self)}
						title={'您確定要儲存嗎?'}
						elementId={'showSaveSeriesDialog'}
					/>
					<DialogModal
						showModal={showDialogModals.canNotUpdateStatus}
						switchShowFunc={self.switchDialogModal.bind(self, 'canNotUpdateStatus')}
						submitFunc={() => {}}
						title={'因為您已經有新的季數在追蹤，因此無法更動此季狀態，只可對集數做更動'}
						elementId={'canNotUpdateStatusDialog'}
					/>
					<InputModal
						showModal={showInputModals.showAddSeries}
						switchShowFunc={self.switchInputModal.bind(self, 'showAddSeries')}
						submitFunc={self.addSeries.bind(self)}
						title={'新增影集'}
						params={[{title: 'title', value: ''}, {title: 'link', value: ''}]}
						elementId={'addSeriesModal'}
					/>
					<InputModal
						showModal={showInputModals.showEditSeries}
						switchShowFunc={self.switchInputModal.bind(self, 'showEditSeries')}
						submitFunc={self.updateSeries.bind(self)}
						title={'編輯影集資訊'}
						params={[{title: 'title', value: editSeriesParams.item.title}, {title: 'link', value: editSeriesParams.item.link}]}
						elementId={'editSeriesModal'}
					/>
					<InputModal
						showModal={showInputModals.showEditSeason}
						switchShowFunc={self.switchInputModal.bind(self, 'showEditSeason')}
						submitFunc={self.updateSeason.bind(self)}
						title={'編輯該季資訊'}
						params={[{title: 'title', value: editSeasonParams.item.title}, {title: 'link', value: editSeasonParams.item.link}]}
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

function mapDispatchToProps() {
	return {
		actions: null,
		// actions: bindActionCreators(seriesActions, dispatch),
	};
}

/**
* Connect Redux with this Component. (Container is on of the design pattern of React-Redux)
*/
export default connect(mapStateToProps, mapDispatchToProps)(SeriesBoxContainer);

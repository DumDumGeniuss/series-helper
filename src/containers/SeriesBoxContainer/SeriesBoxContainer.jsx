import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as seriesActions from '../../actions/series.js';

import ItemsBox from '../../components/box/ItemsBox/ItemsBox.jsx';


const testItemsBox2 = [
	{
		title: 'The Big Bang Theory',
		status: 0,
		items: [
			{
				status: 2,
				items: [
					{
						status: 2,
					},
					{
						status: 2,
					},
					{
						status: 2,
					},
				],
			},
			{
				status: 2,
				items: [
					{
						status: 2,
					},
					{
						status: 2,
					},
					{
						status: 2,
					},
				],
			},
			{
				status: 1,
				items: [
					{
						status: 2,
					},
					{
						status: 2,
					},
					{
						status: 2,
					},
				],
			},
		],
	},
];

class SeriesBoxContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidMount() {
		const { actions } = this.props;
		actions.querySeries();
	}
	updateSeriesStatus(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].status = (series.items[index].status + 1) % 3;
		actions.updateSeries(series.items);
	}
	updateSeasonStatus(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].status = (series.items[index].items[seasonIndex].status + 1) % 3;
		actions.updateSeries(series.items);
	}
	updateEpStatus(index, seasonIndex, epIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items[epIndex].status = (series.items[index].items[seasonIndex].items[epIndex].status + 1) % 3;
		actions.updateSeries(series.items);
	}
	addSeason(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items.push({
			status: 0,
			items: [],
		});
		console.log(series);
		actions.updateSeries(series.items);
	}
	addEp(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items.push({
			status: 0,
		});
		actions.updateSeries(series.items);
	}
	deleteSeason(index) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items.splice(series.items[index].items.length - 1, 1);
		actions.updateSeries(series.items);
	}
	deleteEp(index, seasonIndex) {
		const { actions } = this.props;
		const { series } = this.props.state;
		series.items[index].items[seasonIndex].items.splice(series.items[index].items[seasonIndex].items.length - 1, 1);
		actions.updateSeries(series.items);
	}
	render () {
		const self = this;
		const { series } = self.props.state;
		const state = self.state;
		const style = require('./SeriesBoxContainer.scss');
		return (
			<div className={style.itemBoxContainer}>
				{
					series.items.map( (item, index) => {
						return (
							<ItemsBox
								key={index}
								item={item}
								prewords={null}
								updateStatusFunc={self.updateSeriesStatus.bind(self, index)}
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
						)
					})
				}
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

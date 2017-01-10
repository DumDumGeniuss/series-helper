import React from 'react';
import { Link } from 'react-router';
import LogoBox from '../../box/LogoBox/LogoBox.js';

class HomePage extends React.Component {
	static get propTypes() {
		return {
		}
	}
	render () {
		const style = require('./HomePage.scss');
		const functionIndicator1 = require('./functionIndicator1.jpg');
		const functionIndicator2 = require('./functionIndicator2.jpg');
		const functionIndicator3 = require('./functionIndicator3.jpg');
		return (
			<div className={style.homePageContainer}>
				<div className={style.firstZone}>
					<h1 className={style.firstZoneTitle}>閒暇時間追劇最佳幫手，追劇妙管家!</h1>
					<Link to={'/series'} className={style.logoBoxContainer}>
						<LogoBox />
					</Link>
					<h2 className={style.firstZoneSubTitle}>點擊圖示進入</h2>
				</div>
				<div className={style.secondZone}>
					<h2 className={style.secondZoneTitle}>操作介面</h2>
					<h2 className={style.secondZoneSubTitle}>利用簡易的操作介面管理您所有的追劇進度</h2>
					<div className={style.displayPhoto}>
						<img src={functionIndicator1} />
					</div>
					<h2 className={style.secondZoneSubTitle}>亦可利用編輯新增其他網站<b>首頁</b>連結，方便您輕鬆追劇</h2>
					<div className={style.displayPhoto}>
						<img src={functionIndicator2} />
					</div>
					<h2 className={style.secondZoneSubTitle}>若您富有創意，您也可以紀錄影集以外的事務</h2>
					<div className={style.displayPhoto}>
						<img src={functionIndicator3} />
					</div>
					<h2 className={style.secondZoneSubTitle}>無需耗費時間做繁瑣的安裝及註冊程序</h2>
					<h2 className={style.secondZoneSubTitle}>您只需要瀏覽器跟您的Facebook帳號即可快速登陸使用！</h2>
				</div>
				<div className={style.firstZone}>
					<h2 className={style.firstZoneTitle}>簡單步驟，開始記錄您的追劇進度</h2>
					<h2 className={style.firstZoneSubTitle}>1. 點擊右上角登入FB帳號</h2>
					<h2 className={style.firstZoneSubTitle}>2. 點擊頁面上方圖示</h2>
				</div>
			</div>
		);
	}
}

export default HomePage;

import React from 'react';
import { Link } from 'react-router';
import LogoBox from '../../box/LogoBox/LogoBox.jsx';

class HomePage extends React.Component {
	static get propTypes() {
		return {
		}
	}
	render () {
		const style = require('./HomePage.scss');
		const functionIndicator1 = require('./functionIndicator1.jpg');
		return (
			<div className={style.homePageContainer}>
				<div className={style.firstZone}>
					<h1 className={style.firstZoneTitle}>The best tool to memorize all your TV show progress，Series Helper!</h1>
					<Link to={'/series'} className={style.logoBoxContainer}>
						<LogoBox />
					</Link>
					<h1 className={style.firstZoneSubTitle}>點擊圖示進入</h1>
				</div>
				<div className={style.secondZone}>
					<h1 className={style.secondZoneTitle}>操作介面</h1>
					<div className={style.displayPhoto}>
						<img src={functionIndicator1} />
					</div>
					<h1 className={style.secondZoneSubTitle}>利用簡易的操作介面管理您所有的追劇進度</h1>
					<h1 className={style.secondZoneSubTitle}>點選編輯按鈕可以輸入您的影片連結，讓您輕鬆追劇</h1>
					<h1 className={style.secondZoneSubTitle}>若您富有創意，您也可以紀錄影集以外的事務</h1>
					<h1 className={style.secondZoneSubTitle}>無需耗費時間做繁瑣的安裝及註冊程序</h1>
					<h1 className={style.secondZoneSubTitle}>您只需要瀏覽器跟您的Facebook帳號即可快速登陸使用！</h1>
				</div>
				<div className={style.firstZone}>
					<h1 className={style.firstZoneTitle}>簡單步驟，開始記錄您的追劇進度</h1>
					<h1 className={style.firstZoneSubTitle}>1. 點擊右上角登入FB帳號</h1>
					<h1 className={style.firstZoneSubTitle}>2. 點擊頁面上方圖示</h1>
				</div>
			</div>
		);
	}
}

export default HomePage;

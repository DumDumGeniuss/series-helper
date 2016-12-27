import React from 'react';
import serialize from 'serialize-javascript';

const css = `
	body {
		margin: 0px;
		font-size: 50%;
	}
	* {
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	}
	a {
		text-decoration: none;
		cursor: none;
	}
		a:hover {
	}

	@media screen and (max-width: 500px) {
		body {
			font-size: 25%;
		}
	}
`;

class Html extends React.Component {
	render () {
		const { assets, reactHtml, store } = this.props;
		return (
			<html>
				<head>
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					{Object.keys(assets.styles).map((style, key) =>
						<link href={assets.styles[style]} key={key} media="screen, projection"
							rel="stylesheet" type="text/css" charSet="UTF-8"/>
					)}
					<style>{css}</style>
				</head>
				<body>
					<div id="app" dangerouslySetInnerHTML={{ __html: reactHtml }}></div>
					<script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${serialize(store.getState())}`}}/>
					<script src={assets.javascript.main} charSet="UTF-8"/>
				</body>
			</html>
		);
	}
}

export default Html;

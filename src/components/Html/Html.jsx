import React from 'react';
import serialize from 'serialize-javascript';

const css = `
	body {
		margin: 0px;
		font-size: 50%;
		-webkit-text-size-adjust: none;
	}
	* {
		box-sizing: border-box;
		font-family: 'helvetica neue',helvetica,arial,'lucida grande',sans-serif;
	}
	a {
		text-decoration: none;
		cursor: none;
	}
		a:hover {
	}

	@media screen and (max-width: 500px) {
		body {
			font-size: 40%;
		}
	}
`;

const fbScript = `
  var IS_FB_API_LOADED = false;
  window.fbAsyncInit = function() {
  FB.init({
    appId      : '${process.env.FACEBOOK_API_ID}',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
  });

  IS_FB_API_LOADED = true;

  var event = new CustomEvent("fb-api-loaded", { "detail": "FB api loaded!!" });
  document.dispatchEvent(event);

  };
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

</script>
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
					<script dangerouslySetInnerHTML={{ __html: fbScript}}/>
					<div id="app" dangerouslySetInnerHTML={{ __html: reactHtml }}></div>
					<script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${serialize(store.getState())}`}}/>
					<script src={assets.javascript.main} charSet="UTF-8"/>
				</body>
			</html>
		);
	}
}

export default Html;

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

  FB.getLoginStatus(function(response) {
  	console.log(response);
  	console.log(new Date());
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

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
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

require('./styles.css');
var moment = require('moment');
var openLoopConnect = require('openloop-html-connect');

// -----------------------------------------------------
// Defaults for local testing on dev environment:
// set default sync path.
openLoopConnect.setDefaultSyncPath('c://myAssetsFolderOnDevEnvironment/');
// set default assets (images and videos)
openLoopConnect.feeds.assets.addDefaultFeed('cloudy')
	.addItem('cloudy.jpg')
	.addItem('cloudy.mp4');
openLoopConnect.feeds.assets.addDefaultFeed('sunny')
	.addItem('sunny.jpg')
	.addItem('sunny.mp4');
// set default json feed
openLoopConnect.feeds.json.addDefaultFeed('weather', {
	panels: [
		{ id: 123, status: 'cloudy' },
		{ id: 456, status: 'sunny' }
	]
});
// End of defaults for local testing definition.
// ------------------------------------------------------

var createElementWithText = function (element, text) {
	var element = document.createElement(element);
	var textNode = document.createTextNode(text);
	element.appendChild(textNode);
	document.body.appendChild(element);
}

createElementWithText('h1', 'QDOT HTML5 Creative Sample');
openLoopConnect.load(function () {
	let imageToDisplay;
	let videoToDisplay;

	try {
		createElementWithText('p', 'Current date: ' + moment().format());
		createElementWithText('p', 'Sync path: ' + openLoopConnect.getSyncPath());
		createElementWithText('p', 'Is Debug: ' + openLoopConnect.isDebug());
		createElementWithText('p', 'Is Live: ' + openLoopConnect.isLive());
		createElementWithText('p', 'FrameID: ' + openLoopConnect.getFrameId());

		// Your logic depending on frame_id and parsing of feed data.
		// e.g. Get GrandVisual feed with weather data associated to a frameId.
		let customFeed = openLoopConnect.feeds.json.getFeed('weather');
		let frameId = parseInt(openLoopConnect.getFrameId());
		// The following parse is based on your own feed json structure
		// just an example.
		let panelWeatherData = customFeed.panels.filter(function (panel) {
			return panel.id === frameId;
		}).pop();
		let currentWeather = panelWeatherData.status;

		// Your logic depending on feed data.
		let assetsFeed;
		switch (currentWeather) {
			case 'cloudy':
				assetsFeed = openLoopConnect.feeds.assets.getFeed('cloudy');
				break;
			case 'sunny':
				assetsFeed = openLoopConnect.feeds.assets.getFeed('sunny');
				break;
		}
		imageToDisplay = assetsFeed[0];
		videoToDisplay = assetsFeed[1];
	} catch (e) {
		createElementWithText('strong', 'Something failed, fallback to embedded defaults.');
		imageToDisplay = 'blob:embeddedImage';
		videoToDisplay = 'blob:embeddedVideo';
	}

	createElementWithText('h2', 'Example assets');
	createElementWithText('p', 'Image: ' + imageToDisplay);
	createElementWithText('p', 'Video: ' + videoToDisplay);
});

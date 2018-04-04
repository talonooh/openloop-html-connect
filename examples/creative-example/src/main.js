require('./styles.css');
import * as moment from 'moment';
import openLoopConnect from 'openloop-html-connect';

// -----------------------------------------------------
// Defaults for local testing on dev environment:
// set defaultables.
openLoopConnect.setDefaultSyncPath('c://myAssetsFolderOnDevEnvironment/');
openLoopConnect.setDefaultForceDefault(false);
openLoopConnect.setDefaultWidth('800');
openLoopConnect.setDefaultHeight('600');
openLoopConnect.setDefaultBackgroundColor('#000000');
// set default assets (images and videos)
openLoopConnect.feeds.assets.addDefaultFeed('cloudy')
	.addItem('cloudy.jpg')
	.addItem('cloudy.mp4');
openLoopConnect.feeds.assets.addDefaultFeed('sunny')
	.addItem('sunny.jpg')
	.addItem('sunny.mp4');
// set default texts
openLoopConnect.feeds.freeTexts.addDefaultFeed('cloudy')
	.addItem('Today is cloudy!');
openLoopConnect.feeds.freeTexts.addDefaultFeed('sunny')
	.addItem('Today is sunny!');
// set default json feed
// By file:
// openLoopConnect.feeds.json.addDefaultFeedFromFile('weather', '../sample.feed.json');
// or by embedded json:
openLoopConnect.feeds.json.addDefaultFeed('weather', {
	panels: [
		{ id: 123, status: 'cloudy' },
		{ id: 456, status: 'sunny' }
	]
});
// End of defaults for local testing definition.
// ------------------------------------------------------

// ------------------------------------------------------
// setDefaultConfigFile is only for testing purposes
// do not include it on your real creative and do not
// use an OpenLoopConfig file for dev environment as
// the structure of the real published config may change.
//openLoopConnect.setDefaultConfigFile('../sample.config.js');
// ------------------------------------------------------

let imageToDisplay;
let videoToDisplay;
let textToDisplay;
const createElementWithText = function (element, text) {
	var element = document.createElement(element);
	var textNode = document.createTextNode(text);
	element.appendChild(textNode);
	document.body.appendChild(element);
}

createElementWithText('h1', 'QDOT HTML5 Creative Sample');

openLoopConnect.load(function () {
	// On success parsing config file or loading setted defaults.
	try {
		createElementWithText('p', 'Current date: ' + moment().format());
		createElementWithText('p', 'Sync path: ' + openLoopConnect.getSyncPath());
		createElementWithText('p', 'IsConfigLoaded: ' + openLoopConnect.isConfigLoaded());
		createElementWithText('p', 'Is Debug: ' + openLoopConnect.isDebug());
		createElementWithText('p', 'Is Live: ' + openLoopConnect.isLive());
		createElementWithText('p', 'FrameID: ' + openLoopConnect.getFrameId());
		createElementWithText('p', 'ForceDefault flag: ' + openLoopConnect.getForceDefault());
		createElementWithText('p', 'Width: ' + openLoopConnect.getWidth());
		createElementWithText('p', 'Height: ' + openLoopConnect.getHeight());
		createElementWithText('p', 'Background color: ' + openLoopConnect.getBackgroundColor());

		// Your logic depending on frame_id and parsing of feed data.
		// e.g. Feed with weather data associated to a frameId.
		let customFeed = openLoopConnect.feeds.json.getFeed('weather');
		let frameId = parseInt(openLoopConnect.getFrameId());
		// The following parse is based on your own feed json structure
		// just an example.
		let panelWeatherData = customFeed.panels.filter(function (panel) {
			return panel.id === frameId;
		}).pop();
		let currentWeather = panelWeatherData.status;

		// Your logic depending on feed data.
		let assetsFeed = openLoopConnect.feeds.assets.getFeed(currentWeather);
	    textToDisplay = openLoopConnect.feeds.freeTexts.getFeed(currentWeather)[0];

		imageToDisplay = assetsFeed[0];
		videoToDisplay = assetsFeed[1];
	} catch (e) {
		// Error on creative logic.
		// e.g.: Feed not found, frameId not found, panel not found, etc..
		fallBackToEmbeddedDefaults();
	}

	renderContent();
}, function (e) {
	console.log(e);
	// On error loading/parsing Config file.
	fallBackToEmbeddedDefaults();
	renderContent();
});

function fallBackToEmbeddedDefaults() {
	createElementWithText('strong', 'Something failed, fallback to embedded defaults.');
	imageToDisplay = 'blob:embeddedImage';
	videoToDisplay = 'blob:embeddedVideo';
	textToDisplay = 'embeddedText';
}

function renderContent() {
	createElementWithText('h2', 'Example content');
	createElementWithText('p', 'Text: ' + textToDisplay);
	createElementWithText('p', 'Image: ' + imageToDisplay);
	createElementWithText('p', 'Video: ' + videoToDisplay);
}

require('./styles.css');
var moment = require('moment');
var openLoopConnect = require('openloop-html-connect');

var createElementWithText = function(element, text) {
	var element = document.createElement(element);
	var textNode = document.createTextNode(text);
	element.appendChild(textNode);
	document.body.appendChild(element);
}

createElementWithText('h1', 'QDOT HTML5 Creative Sample');
createElementWithText('p', 'Current date: ' + moment().format());
createElementWithText('p', 'Sync path: ' + openLoopConnect.getSyncPath());
createElementWithText('p', 'Is Debug: ' + openLoopConnect.isDebug());
createElementWithText('p', 'Is Live: ' + openLoopConnect.isLive());
createElementWithText('p', 'FrameID: ' + openLoopConnect.getFrameId());

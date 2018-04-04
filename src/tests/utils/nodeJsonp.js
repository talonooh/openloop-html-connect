const fs = require('fs');
const JSONP = require('jsonp-node');

const nodeJsonp = (url) => {
	return new Promise(resolve => {
		fs.readFile(url, 'utf8', (error, data) => {
			const result = JSONP.parse(data, 'openLoopConfig');
			resolve(result);
		});
	});
}

global.nodeJsonp = nodeJsonp;

module.exports = nodeJsonp;

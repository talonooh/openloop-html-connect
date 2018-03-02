const path = require('path');
const openLoopConnect = require('../../');
require('./nodeJsonp');

describe('openLoopConnect.feeds using config file', () => {
	const configPath = (configFile) => path.resolve('src/tests/configs/' + configFile);

	beforeEach(async () => new Promise(resolve => {
		global.window = {
			location: {
				href: ''
			}
		};
		openLoopConnect.reset();
		openLoopConnect.setDefaultConfigFile(configPath('simple.config.js'));
		openLoopConnect.load(resolve);
	}));

	describe('feeds.json', () => {
		describe('when using getFeed', () => {
			it('should return the value setted', () => {
				expect(openLoopConnect.feeds.json.getFeed('weather').regions.region[0]['@id']).toBe('London');
				expect(openLoopConnect.feeds.json.getFeed('weather').regions.region[0]['@condition']).toBe('3');
			});
		});
	});
});

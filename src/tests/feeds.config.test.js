require('./utils/nodeWindow');
require('./utils/nodeJsonp');
const path = require('path');
const openLoopConnect = require('../../');

describe('using config files', () => {
	const configPath = (configFile) => path.resolve('src/tests/configs/' + configFile);

	beforeEach(() => {
		window = {
			location: {
				href: ''
			}
		};
		openLoopConnect.reset();
		openLoopConnect.setDefaultSyncPath('./');
	});

	describe('before loading a config file', () => {
		it('isConfigLoaded should be false', () => {
			expect(openLoopConnect.isConfigLoaded()).toBeFalsy();
		});
	});

	describe('after loading a config file', () => {
		beforeEach(async () => new Promise(resolve => {
			openLoopConnect.setDefaultConfigFile(configPath('simple.config.js'));
			openLoopConnect.load(resolve);
		}));

		it('isConfigLoaded should be true', () => {
			expect(openLoopConnect.isConfigLoaded()).toBeTruthy();
		});
	});

	describe('when setting default feeds but then loading a simple config file', () => {
		beforeEach(async () => new Promise(resolve => {
			openLoopConnect.feeds.assets.addDefaultFeed('cloudy')
				.addItem('cloudy.jpg')
				.addItem('cloudy.mp4');

			openLoopConnect.feeds.freeTexts.addDefaultFeed('cloudy')
				.addItem('Today is cloudy')
				.addItem('Today is overcast');

			openLoopConnect.feeds.json.addDefaultFeed('weather', {
				panels: [
					{ id: 12345, status: 'cloudy' },
					{ id: 45678, status: 'sunny' }
				]
			});

			openLoopConnect.setDefaultConfigFile(configPath('simple.config.js'));
			openLoopConnect.load(resolve);
		}));

		describe('when using getFeed', () => {
			it('should not return the defaults values setted', () => {
				expect(() => {
					openLoopConnect.feeds.assets.getFeed('cloudy')
				}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);

				expect(() => {
					openLoopConnect.feeds.freeTexts.getFeed('cloudy')
				}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);

				expect(openLoopConnect.feeds.json.getFeed('weather').panels).toBe(undefined);
			});
		});
	});

	describe('when loading a simple config', () => {
		beforeEach(async () => new Promise(resolve => {
			openLoopConnect.setDefaultConfigFile(configPath('simple.config.js'));
			openLoopConnect.load(resolve);
		}));

		describe('feeds.assets.getFeed', () => {
			it('should return the correct value parsed from config', () => {
				expect(openLoopConnect.feeds.assets.getFeed('default')[0]).toBe('./1198_172_background.png');
			});

			it('should not return invalid feed', () => {
				expect(() => {
					openLoopConnect.feeds.assets.getFeed('invalid');
				}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);
			});
		});

		describe('feeds.json.getFeed', () => {
			it('should return the correct value parsed from config', () => {
				const regions = openLoopConnect.feeds.json.getFeed('weather').regions;
				expect(regions.region[0]['@id']).toBe('London');
				expect(regions.region[0]['@condition']).toBe('3');
				expect(regions.region[2]['@id']).toBe('Yorkshire');
				expect(regions.region[2]['@condition']).toBe('2');
			});
		});

		describe('isPublishedAfter', () => {
			it('should return false for a date after 2018-02-16', () => {
				expect(openLoopConnect.isPublishedAfter(new Date('2018-02-17'))).toBe(false);
			});
			it('should return true for a date before 2018-02-16', () => {
				expect(openLoopConnect.isPublishedAfter(new Date('2018-02-15'))).toBe(true);
			});
		});
	});

	describe('when loading a complex config', () => {
		beforeEach(async () => new Promise(resolve => {
			openLoopConnect.setDefaultConfigFile(configPath('complex.config.js'));
			openLoopConnect.load(resolve);
		}));

		describe('feeds.assets.getFeed', () => {
			it('should return the correct value parsed from config', () => {
				const imageFeed1 = openLoopConnect.feeds.assets.getFeed('ImageFeed1');
				expect(imageFeed1[0]).toBe('./1206_175_1158_93_1 - clear night.jpg');
				expect(imageFeed1[1]).toBe('./1206_176_1158_94_2 - sunny.jpg');
				expect(imageFeed1[2]).toBe('./1206_177_1158_95_3 - cloudy.jpg');

				const imageFeed2 = openLoopConnect.feeds.assets.getFeed('ImageFeed2');
				expect(imageFeed2[0]).toBe('./1207_178_1158_96_4 - rainy.jpg');
				expect(imageFeed2[1]).toBe('./1207_179_1158_97_5 - snow.jpg');
				expect(imageFeed2[2]).toBe('./1207_180_1158_98_6 - hail.jpg');
			});
		});

		describe('feeds.freeTexts.getFeed', () => {
			it('should return the correct value parsed from config', () => {
				const textFeed1 = openLoopConnect.feeds.freeTexts.getFeed('TextFeed1');
				expect(textFeed1[0]).toBe('Text number 1');
				expect(textFeed1[1]).toBe('Text number 2');
				expect(textFeed1[2]).toBe('Text number 3');

				const textFeed2 = openLoopConnect.feeds.freeTexts.getFeed('TextFeed2');
				expect(textFeed2[0]).toBe('Text number 1');
				expect(textFeed2[1]).toBe('Text number 2');
				expect(textFeed2[2]).toBe(undefined);
			});
		});

		describe('isPublishedAfter', () => {
			it('should return false for a date after 2018-03-02', () => {
				expect(openLoopConnect.isPublishedAfter(new Date('2018-03-03'))).toBe(false);
			});
			it('should return true for a date before 2018-03-02', () => {
				expect(openLoopConnect.isPublishedAfter(new Date('2018-03-01'))).toBe(true);
			});
		});
	});

	describe('when loading a complete config', () => {
		beforeEach(async () => new Promise(resolve => {
			openLoopConnect.setDefaultConfigFile(configPath('complete.config.js'));
			openLoopConnect.load(resolve);
		}));

		describe('feeds.assets.getFeed', () => {
			it('should return the correct value parsed from config', () => {
				const imageFeed1 = openLoopConnect.feeds.assets.getFeed('ImageFeed1');
				expect(imageFeed1[0]).toBe('./1206_175_1158_93_1 - clear night.jpg');
				expect(imageFeed1[1]).toBe('./1206_176_1158_94_2 - sunny.jpg');
				expect(imageFeed1[2]).toBe('./1206_177_1158_95_3 - cloudy.jpg');

				const imageFeed2 = openLoopConnect.feeds.assets.getFeed('ImageFeed2');
				expect(imageFeed2[0]).toBe('./1207_178_1158_96_4 - rainy.jpg');
				expect(imageFeed2[1]).toBe('./1207_179_1158_97_5 - snow.jpg');
				expect(imageFeed2[2]).toBe('./1207_180_1158_98_6 - hail.jpg');
			});
		});

		describe('feeds.freeTexts.getFeed', () => {
			it('should return the correct value parsed from config', () => {
				const textFeed1 = openLoopConnect.feeds.freeTexts.getFeed('TextFeed1');
				expect(textFeed1[0]).toBe('Text number 1');
				expect(textFeed1[1]).toBe('Text number 2');
				expect(textFeed1[2]).toBe('Text number 3');

				const textFeed2 = openLoopConnect.feeds.freeTexts.getFeed('TextFeed2');
				expect(textFeed2[0]).toBe('Text number 1');
				expect(textFeed2[1]).toBe('Text number 2');
				expect(textFeed2[2]).toBe(undefined);
			});
		});

		describe('feeds.json.getFeed', () => {
			it('should return the correct value parsed from config', () => {
				const ApiFeed5Regions = openLoopConnect.feeds.json.getFeed('ApiFeed5').regions;
				expect(ApiFeed5Regions.region).toHaveLength(18);
				expect(ApiFeed5Regions.region[0]['@id']).toBe('STVCentral');
				expect(ApiFeed5Regions.region[0]['@ws']).toBe('11');
				expect(ApiFeed5Regions.region[0]['@qdwt']).toBe('3');

				const ApiFeed6Regions = openLoopConnect.feeds.json.getFeed('ApiFeed6').regions;
				expect(ApiFeed6Regions.region).toHaveLength(18);
				expect(ApiFeed6Regions.region[17]['@id']).toBe('Lambeth');
				expect(ApiFeed5Regions.region[17]['@ws']).toBe('4');
				expect(ApiFeed6Regions.region[17]['@qdwt']).toBe('3');
			});
		});
	});

	describe('when loading a config with showDefault = "true" ', () => {
		beforeEach(async () => new Promise(resolve => {
			openLoopConnect.setDefaultConfigFile(configPath('forceDefaultTrue.config.js'));
			openLoopConnect.load(resolve);
		}));

		it('getForceDefault() should return true', () => {
			expect(openLoopConnect.getForceDefault()).toEqual(true);
		})
	});

	describe('when loading a config with showDefault = "false" ', () => {
		beforeEach(async () => new Promise(resolve => {
			openLoopConnect.setDefaultConfigFile(configPath('simple.config.js'));
			openLoopConnect.load(resolve);
		}));

		it('getForceDefault() should return true', () => {
			expect(openLoopConnect.getForceDefault()).toEqual(false);
		})
	});
});

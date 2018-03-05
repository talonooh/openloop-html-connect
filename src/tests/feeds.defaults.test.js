const openLoopConnect = require('../../');

describe('openLoopConnect.feeds using defaults', () => {
	beforeEach(async () => {
		global.window = {
			location: {
				href: ''
			}
		};
		openLoopConnect.reset();
		await openLoopConnect.load();
	});

	describe('feeds.assets', () => {
		describe('when using addDefaultFeed', () => {
			beforeEach(() => {
				openLoopConnect.feeds.assets.addDefaultFeed('cloudy')
					.addItem('cloudy.jpg')
					.addItem('cloudy.mp4');

				openLoopConnect.feeds.assets.addDefaultFeed('sunny')
					.addItem('sunny.jpg')
					.addItem('sunny.mp4');

				openLoopConnect.feeds.assets.addDefaultFeed('default')
					.addItem('default.jpg')
					.addItem('default.mp4');
			});

			describe('when using getFeed', () => {
				it('should return the value setted', () => {
					expect(openLoopConnect.feeds.assets.getFeed('cloudy')[0]).toBe('./cloudy.jpg');
					expect(openLoopConnect.feeds.assets.getFeed('cloudy')[1]).toBe('./cloudy.mp4');
					expect(openLoopConnect.feeds.assets.getFeed('cloudy')[2]).toBe(undefined);

					expect(openLoopConnect.feeds.assets.getFeed('default')[0]).toBe('./default.jpg');
					expect(openLoopConnect.feeds.assets.getFeed('default')[1]).toBe('./default.mp4');
					expect(openLoopConnect.feeds.assets.getFeed('default')[2]).toBe(undefined);
				});

				describe('and setting setDefaultSyncPath', () => {
					beforeEach(() => {
						openLoopConnect.setDefaultSyncPath('/var/myPath/');
					});

					it('should return the value setted prefixed with correct path', () => {
						expect(openLoopConnect.feeds.assets.getFeed('cloudy')[0]).toBe('/var/myPath/cloudy.jpg');
					});
				});
			});
		});
	});

	describe('feeds.freeTexts', () => {
		describe('when using addDefaultFeed', () => {
			beforeEach(() => {
				openLoopConnect.feeds.freeTexts.addDefaultFeed('cloudy')
					.addItem('Today is cloudy')
					.addItem('Today is overcast');

				openLoopConnect.feeds.freeTexts.addDefaultFeed('sunny')
					.addItem('Today is sunny');
			});

			describe('when using getFeed', () => {
				it('should return the value setted', () => {
					expect(openLoopConnect.feeds.freeTexts.getFeed('cloudy')[0]).toBe('Today is cloudy');
					expect(openLoopConnect.feeds.freeTexts.getFeed('cloudy')[1]).toBe('Today is overcast');

					expect(openLoopConnect.feeds.freeTexts.getFeed('sunny')[0]).toBe('Today is sunny');
				});
			});

			describe('and after using reset', () => {
				beforeEach(() => {
					openLoopConnect.reset()
				});

				it('should not let you access feeds before load', () => {
					expect(() => {
						openLoopConnect.feeds.freeTexts.getFeed('cloudy');
					}).toThrowError(openLoopConnect.errors.InvalidOperationError);
				});

				describe('and after re-loading', () => {
					beforeEach(async () => {
						await openLoopConnect.load();
					});

					it('should not have values', () => {
						expect(() => {
							openLoopConnect.feeds.freeTexts.getFeed('cloudy');
						}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);
					});
				});
			});
		});
	});

	describe('feeds.json', () => {
		describe('when using addDefaultFeed', () => {
			beforeEach(() => {
				openLoopConnect.feeds.json.addDefaultFeed('weather', {
					panels: [
						{ id: 12345, status: 'cloudy' },
						{ id: 45678, status: 'sunny' }
					]
				});
				openLoopConnect.feeds.json.addDefaultFeed('traffic', {
					panels: [
						{ id: 12345, status: 'slow' },
						{ id: 45678, status: 'fast' }
					]
				});
			});

			describe('when using getFeed', () => {
				it('should return the value setted', () => {
					expect(openLoopConnect.feeds.json.getFeed('weather').panels[0].status).toBe('cloudy');
					expect(openLoopConnect.feeds.json.getFeed('traffic').panels[0].status).toBe('slow');
				});
			});

			describe('and after using reset', () => {
				beforeEach(() => {
					openLoopConnect.reset()
				});

				it('should not let you access feeds before load', () => {
					expect(() => {
						openLoopConnect.feeds.json.getFeed('weather');
					}).toThrowError(openLoopConnect.errors.InvalidOperationError);
				});

				describe('and after re-loading', () => {
					beforeEach(async () => {
						await openLoopConnect.load();
					});

					it('should not have values', () => {
						expect(() => {
							openLoopConnect.feeds.json.getFeed('weather');
						}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);
					});
				});
			});
		});
	});
});

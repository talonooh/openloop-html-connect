const openLoopConnect = require('../../');

describe('openLoopConnect defaultables', () => {
	const sampleLiveCampaignUrl = 'https://stgdp.openloop.it/QDOT/UK/HTML5/DirectPanel/onetime/index.html';

	const setLocationHref = (url) => {
		window.location.href = url;
	};

	describe('when using them before load', () => {
		beforeEach(() => {
			global.window = {
				location: {
					href: ''
				}
			};
			openLoopConnect.reset();
		});

		describe('when trying to read sync path', () => {
			it('should throw error', () => {
				expect(() => {
					openLoopConnect.getSyncPath()
				}).toThrowError(openLoopConnect.errors.InvalidOperationError);
			});
		});
	});

	describe('when using them after load', () => {
		beforeEach(async () => {
			global.window = {
				location: {
					href: ''
				}
			};
			openLoopConnect.reset();
			await openLoopConnect.load();
		});

		describe('getSyncPath', () => {
			it('should return ./ by default', () => {
				expect(openLoopConnect.getSyncPath()).toBe('./');
			});

			describe('when using the creative from openloop servers and it is a live campaign', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl);
				});

				it('should return ../sync/', () => {
					expect(openLoopConnect.getSyncPath()).toBe('../sync/');
				});

				describe('and despite the defaultSyncPath is setted', () => {
					beforeEach(() => {
						openLoopConnect.setDefaultSyncPath('myPath');
					});

					it('should return ../sync/', () => {
						expect(openLoopConnect.getSyncPath()).toBe('../sync/');
					});
				});
			});

			describe('when setting default using setDefaultSyncPath', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultSyncPath('myPath');
				});

				it('should return the value setted', () => {
					expect(openLoopConnect.getSyncPath()).toBe('myPath');
				});
			});

			describe('when setting using setSyncPath', () => {
				beforeEach(() => {
					openLoopConnect.setSyncPath('myFinalPath');
				});

				it('should return the value setted', () => {
					expect(openLoopConnect.getSyncPath()).toBe('myFinalPath');
				});
			});
		});

		describe('getFrameId', () => {
			it('should return null if there is no query string', () => {
				expect(() => {
					openLoopConnect.getFrameId()
				}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);
			});

			describe('when using frame_id on the query string', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl + '?frame_id=12345');
				});

				it('should return correct value', () => {
					expect(openLoopConnect.getFrameId()).toBe('12345');
				});
			});

			describe('when using player_id on the query string', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl + '?player_id=123456789');
				});

				it('should return correct value', () => {
					expect(openLoopConnect.getFrameId()).toBe('123456789');
				});
			});
		});

		describe('isLive', () => {
			it('should return false on local environment', () => {
				expect(openLoopConnect.isLive()).toBeFalsy();
			});

			describe('when using the creative from openloop servers and it is a live campaign', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl);
				});

				it('should return true', () => {
					expect(openLoopConnect.isLive()).toBeTruthy();
				});
			});

		});

		describe('isDebug', () => {
			it('should return false by default', () => {
				expect(openLoopConnect.isDebug()).toBeFalsy();
			});

			describe('when setting the debug flag on the query string', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl + '?frame_id=12345&debug=1');
				});

				it('should return true', () => {
					expect(openLoopConnect.isDebug()).toBeTruthy();
				});
			});
		});
	});
});

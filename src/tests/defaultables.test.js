require('./utils/nodeWindow');
const openLoopConnect = require('../../');
const packageJson = require('../../package.json');

describe('openLoopConnect defaultables', () => {
	const sampleLiveCampaignUrl = 'https://stgdp.openloop.it/QDOT/UK/HTML5/DirectPanel/onetime/index.html';

	const setLocationHref = (url) => {
		window.location.href = url;
	};

	describe('when using getVersion', () => {
		it('should return package.json version', () => {
			expect(openLoopConnect.getVersion()).toBe(packageJson.version);
		});
	});

	describe('when using them before load', () => {
		beforeEach(() => {
			window = {
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

		describe('when trying to read Last Published Date', () => {
			it('should throw error', () => {
				expect(() => {
					openLoopConnect.getLastPublishedDate()
				}).toThrowError(openLoopConnect.errors.InvalidOperationError);
			});
		});
	});

	describe('when using them after load', () => {
		beforeEach(async () => new Promise(resolve => {
			window = {
				location: {
					href: ''
				}
			};
			openLoopConnect.reset();
			openLoopConnect.load(resolve);
		}));

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
		/*  */
		describe('getFrameId', () => {
			it('should return null if there is no query string', () => {
				expect(() => {
					openLoopConnect.getFrameId()
				}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);
			});

			describe('when using setDefaultFrameId', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultFrameId('456');
				});

				it('should return default value', () => {
					expect(openLoopConnect.getFrameId()).toBe('456');
				});
			});

			describe('when using frame_id on the query string', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl + '?frame_id=12345');
				});

				it('should return correct value', () => {
					expect(openLoopConnect.getFrameId()).toBe('12345');
				});

				describe('and even when using setDefaultFrameId', () => {
					beforeEach(() => {
						openLoopConnect.setDefaultFrameId('456');
					});

					it('should still return query string value', () => {
						expect(openLoopConnect.getFrameId()).toBe('12345');
					});
				});
			});
			describe('when using BroadSignObject', () => {
				beforeEach(() => {
					window.BroadSignObject = {
						frame_id: '999'
					};
				});

				it('should return correct value', () => {
					expect(openLoopConnect.getFrameId()).toBe('999');
				});
			});
		});
		/*  */
		describe('getPlayerId', () => {
			it('should return null if there is no query string', () => {
				expect(() => {
					openLoopConnect.getPlayerId()
				}).toThrowError(openLoopConnect.errors.ResourceNotFoundError);
			});

			describe('when using setDefaultPlayerId', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultPlayerId('456');
				});

				it('should return default value', () => {
					expect(openLoopConnect.getPlayerId()).toBe('456');
				});
			});

			describe('when using frame_id on the query string', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl + '?player_id=12345');
				});

				it('should return correct value', () => {
					expect(openLoopConnect.getPlayerId()).toBe('12345');
				});

				describe('and even when using setDefaultPlayerId', () => {
					beforeEach(() => {
						openLoopConnect.setDefaultPlayerId('456');
					});

					it('should still return query string value', () => {
						expect(openLoopConnect.getPlayerId()).toBe('12345');
					});
				});
			});

			describe('when using player_id on the query string', () => {
				beforeEach(() => {
					setLocationHref(sampleLiveCampaignUrl + '?player_id=123456789');
				});

				it('should return correct value', () => {
					expect(openLoopConnect.getPlayerId()).toBe('123456789');
				});
			});

			describe('when using BoardSignObject', () => {
				beforeEach(() => {
					window.BroadSignObject = {
						player_id: '999'
					};
				});

				it('should return correct value', () => {
					expect(openLoopConnect.getPlayerId()).toBe('999');
				});
			});
		});
		/*  */
		describe('getForceDefault', () => {
			it('should return null if there is no default or real value', () => {
				expect(openLoopConnect.getForceDefault()).toBeNull();
			});

			describe('when using setDefaultForceDefault', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultForceDefault(true);
				});

				it('should return default value', () => {
					expect(openLoopConnect.getForceDefault()).toBe(true);
				});
			});
		});

		describe('getWidth', () => {
			it('should return null if there is no default or real value', () => {
				expect(openLoopConnect.getWidth()).toBeNull();
			});

			describe('when using setDefaultWidth', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultWidth('800');
				});

				it('should return default value', () => {
					expect(openLoopConnect.getWidth()).toBe('800');
				});
			});
		});

		describe('getHeight', () => {
			it('should return null if there is no default or real value', () => {
				expect(openLoopConnect.getHeight()).toBeNull();
			});

			describe('when using setDefaultHeight', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultHeight('600');
				});

				it('should return default value', () => {
					expect(openLoopConnect.getHeight()).toBe('600');
				});
			});
		});

		describe('getBackgroundColor', () => {
			it('should return null if there is no default or real value', () => {
				expect(openLoopConnect.getBackgroundColor()).toBeNull();
			});

			describe('when using setDefaultBackgroundColor', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultBackgroundColor('#ffffff');
				});

				it('should return default value', () => {
					expect(openLoopConnect.getBackgroundColor()).toBe('#ffffff');
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

		describe('getLastPublishedDate', () => {
			it('should return null if there is no default or real value', () => {
				expect(openLoopConnect.getLastPublishedDate().toString()).toBe(new Date('2000-10-10').toString());
			});

			it('isPublishedAfter should return false for old and far dates', () => {
				expect(openLoopConnect.isPublishedAfter(new Date('2017-01-01'))).toBeFalsy();
			});

			describe('when selecting 2019-07-01 as default published date', () => {
				beforeEach(() => {
					openLoopConnect.setDefaultLastPublishedDate(new Date('2019-07-01'));
				});

				it('should return correct default value', () => {
					expect(openLoopConnect.getLastPublishedDate().toString()).toBe(new Date('2019-07-01').toString());
				});

				it('isPublishedAfter should return true for a date before 2019-07-01', () => {
					expect(openLoopConnect.isPublishedAfter(new Date('2018-12-25'))).toBeTruthy();
				});

				it('isPublishedAfter should return false for a date after 2019-07-01', () => {
					expect(openLoopConnect.isPublishedAfter(new Date('2019-07-02'))).toBeFalsy();
				});
			});
		});
	});
});

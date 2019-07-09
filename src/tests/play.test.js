require('./utils/nodeWindow');
const openLoopConnect = require('../../');

describe('openLoopConnect onPlay', () => {
	const onPlayListener = jest.fn();

	beforeEach(() => {
		onPlayListener.mockClear();
		openLoopConnect.reset();
		openLoopConnect.onPlay(onPlayListener);
	});

	describe('by default', () => {
		describe('before load', () => {
			it('should not call the listener', () => {
				expect(onPlayListener).not.toBeCalled();
			});
		});

		describe('after load', () => {
			beforeEach(async () => new Promise(resolve => {
				openLoopConnect.load(() => {
					setTimeout(resolve, 0);
				});
			}));

			it('should call the listener', () => {
				expect(onPlayListener).toBeCalled();
			});
		});
	});

	describe('when setting a PlayCallback', () => {
		beforeEach(() => {
			openLoopConnect.setDefaultPlayCallback('TestPlayCallback');
		});

		describe('before load', () => {
			it('should not call the listener', () => {
				expect(onPlayListener).not.toBeCalled();
			});

			describe('after calling TestPlayCallback', () => {
				beforeEach(() => {
					window.TestPlayCallback();
				})

				it('should still not call the listener', () => {
					expect(onPlayListener).not.toBeCalled();
				});

				describe('and then after load', () => {
					beforeEach(async () => new Promise(resolve => {
						openLoopConnect.load(() => {
							setTimeout(resolve, 0);
						});
					}));

					it('should call the listener', () => {
						expect(onPlayListener).toBeCalled();
					});
				});
			});
		});

		describe('after load', () => {
			beforeEach(async () => new Promise(resolve => {
				openLoopConnect.load(() => {
					setTimeout(resolve, 0);
				});
			}));

			it('should still not call the listener', () => {
				expect(onPlayListener).not.toBeCalled();
			});

			describe('after calling TestPlayCallback', () => {
				it('should call the listener', () => {
					expect(window.TestPlayCallback).not.toBeNull();
					expect(window.TestPlayCallback).not.toBeUndefined();
					window.TestPlayCallback();
					expect(onPlayListener).toBeCalled();
				});
			});
		});
	});
});

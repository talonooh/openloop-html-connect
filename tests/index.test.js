const openLoopConnect = require('../');

describe('openLoopConnect', () => {
  describe('getSyncPath', () => {
    it('should return ./ by default', () => {
      expect(openLoopConnect.getSyncPath()).toBe('./');
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
      expect(openLoopConnect.getFrameId()).toBeNull();
    });
  });

  describe('isLive', () => {
    it('should return false on local environment', () => {
      expect(openLoopConnect.isLive()).toBeFalsy();
    });
  });

  describe('isDebug', () => {
    it('should return false by default', () => {
      expect(openLoopConnect.isDebug()).toBeFalsy();
    });
  });
});

// UMD: Universal Module Definition
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.openLoopConnect = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
    // OpenLoopConnect HTML5 SDK Library.
    const _openLoopSyncPath = '{{{OPENLOOP-HTML-CONNECT:SYNC-PATH}}}';
    const _liveSyncPath = '../sync/';
    let _defaultSyncPath = './';
    let _syncPath = null;
    let _frameId = null;
    let _isDebugFlag = null;
    const _getQueryString = (field, url) => {
        // from: https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
        const href = url ? url : window.location.href;
        const reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        const string = reg.exec(href);
        return string ? string[1] : null;
    };
    const _isLive = () => {
        const regex = RegExp(/^https\:\/\/(?:[\w_-]\.?)*openloop(?:\.q)?\.(?:media|it)/);
        return regex.test(window.location.href);
    };
    const _getSyncPath = () => {
        if(_syncPath === null) {
            if(_openLoopSyncPath.indexOf('OPENLOOP-HTML-CONNECT') === -1) {
                _syncPath = _openLoopSyncPath;
            } else if(_isLive()) {
                _syncPath = _liveSyncPath;
            } else {
                _syncPath = _defaultSyncPath;
            }
        }
        return _syncPath;
    };
    const _setSyncPath = (syncPath) => {
        _syncPath = syncPath;
    };
    const _setDefaultSyncPath = (newSyncPath) => {
        if(_syncPath === _defaultSyncPath) {
            _syncPath = newSyncPath;
        }
        _defaultSyncPath = newSyncPath;
    };
    const _isDebug = () => {
        if (_isDebugFlag === null) {
            _isDebugFlag = (_getQueryString('debug') !== null);
        }
        return _isDebugFlag;
    };
    const _getFrameId = () => {
        if (_frameId === null) {
            _frameId = _getQueryString('frame_id');
            if (_frameId === null) {
                // If frame_id is not found, fallback to player_id.
                _frameId = _getQueryString('player_id');
            }
            if (_frameId === null) {
                console.log('Frame id requested but not found! Make sure to open this page with "?frame_id=[yourFrameId]" on the query string.');
            }
        }
        return _frameId;
    };

    return {
        getSyncPath: _getSyncPath,
        setDefaultSyncPath: _setDefaultSyncPath,
        setSyncPath: _setSyncPath,
        getFrameId: _getFrameId,
        isLive: _isLive,
        isDebug: _isDebug
    };
}));
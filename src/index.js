(function (root, factory) {
	// UMD: Universal Module Definition
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
	var _openLoopSyncPath = '{{{OPENLOOP-HTML-CONNECT:SYNC-PATH}}}',
		_liveSyncPath = '../sync/',
		_defaultSyncPath = './',
		_syncPath = null,
		_frameId = null,
		_isDebugFlag = null,
		_getQueryString = function(field, url) {
			// from: https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
			var href = url ? url : window.location.href,
				reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' ),
				string = reg.exec(href);
			return string ? string[1] : null;
		},
		_isLive = function() {
			var regex = RegExp(/^https\:\/\/(?:[\w_-]\.?)*openloop(?:\.q)?\.(?:media|it)/);
			return regex.test(window.location.href);
		},
		_getSyncPath = function() {
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
		},
		_setSyncPath = function(syncPath) {
			_syncPath = syncPath;
		},
		_setDefaultSyncPath = function(newSyncPath) {
			if(_syncPath === _defaultSyncPath) {
				_syncPath = newSyncPath;
			}
			_defaultSyncPath = newSyncPath;
		},
		_isDebug = function() {
			if (_isDebugFlag === null) {
				_isDebugFlag = (_getQueryString('debug') !== null);
			}
			return _isDebugFlag;
		},
		_getFrameId = function() {
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

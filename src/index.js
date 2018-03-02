require('es6-promise').polyfill();
import Defaultable from 'lib/Defaultable';
import { getQueryString, isLive } from 'lib/Utils';
import FeedsCollection from 'lib/FeedsCollection';
import ArrayFeedsCollection from 'lib/ArrayFeedsCollection';
import fetchJsonp from 'fetch-jsonp';
import ConfigLoader from 'lib/ConfigLoader';

const OpenLoopConnect = () => {
	// OpenLoopConnect HTML5 SDK Library.
	var _openLoopSyncPath = '{{{OPENLOOP-HTML-CONNECT:SYNC-PATH}}}',
		_openLoopConfigFile = '{{{OPENLOOP-HTML-CONNECT:CONFIG-FILE}}}',
		_liveSyncPath = '../sync/',
		_syncPath = new Defaultable('./', defaultValue => {
			if (_openLoopSyncPath.indexOf('OPENLOOP-HTML-CONNECT') === -1) {
				return _openLoopSyncPath;
			} else if (_isLive.getValue()) {
				return _liveSyncPath;
			} else {
				return defaultValue;
			}
		}),
		_configFile = new Defaultable(null, defaultValue => {
			if (_openLoopConfigFile.indexOf('OPENLOOP-HTML-CONNECT') === -1) {
				return _openLoopConfigFile;
			} else {
				return defaultValue;
			}
		}),
		_frameId = new Defaultable(null, () => {
			let frameId = getQueryString('frame_id');
			if (frameId === null) {
				// If frame_id is not found, fallback to player_id.
				frameId = getQueryString('player_id');
			}
			if (frameId === null) {
				console.log('Frame id requested but not found! Make sure to open this page with "?frame_id=[yourFrameId]" on the query string.');
			}
			return frameId;
		}),
		_isDebug = new Defaultable(false, () => (getQueryString('debug') !== null)),
		_isLive = new Defaultable(false, isLive),
		_feeds = {
			assets: new ArrayFeedsCollection(_syncPath),
			freeTexts: new ArrayFeedsCollection(),
			json: new FeedsCollection()
		},
		_configLoader = new ConfigLoader(_configFile, configData => {
			_feeds.json.setFeeds(configData.openLoopConfig.json);
		}),
		_reset = function () {
			// Just for testing purposes.
			_syncPath.reset();
			_configFile.reset();
			_configLoader.reset();
			_frameId.reset();
			_isDebug.reset();
			_isLive.reset();
			_feeds.assets.reset();
			_feeds.freeTexts.reset();
			_feeds.json.reset();
		};

	return {
		getSyncPath: _syncPath.getValue,
		setSyncPath: _syncPath.setValue,
		setDefaultSyncPath: _syncPath.setDefault,
		setDefaultConfigFile: _configFile.setDefault,
		getFrameId: _frameId.getValue,
		isLive: _isLive.getValue,
		isDebug: _isDebug.getValue,
		feeds: _feeds,
		load: _configLoader.load,
		reset: _reset
	};
};

const singletonInstance = OpenLoopConnect();
module.exports = singletonInstance;

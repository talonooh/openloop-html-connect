require('es6-promise').polyfill();
import Defaultable from 'lib/Defaultable';
import { getQueryString, isLive, parseOpenLoopFlag } from 'lib/Utils';
import FeedsCollection from 'lib/FeedsCollection';
import ArrayFeedsCollection from 'lib/ArrayFeedsCollection';
import fetchJsonp from 'fetch-jsonp';
import ConfigLoader from 'lib/ConfigLoader';
import errors, { ResourceNotFoundError } from 'lib/Errors';

const OpenLoopConnect = () => {
	// OpenLoopConnect HTML5 SDK Library.
	var _openLoopSyncPath = '{{{OPENLOOP-HTML-CONNECT:SYNC-PATH}}}',
		_openLoopConfigFile = '{{{OPENLOOP-HTML-CONNECT:CONFIG-FILE}}}',
		_publisherVersion = '{{{OPENLOOP-HTML-CONNECT:PUBLISHER-VERSION}}}',
		_version = '{{OPENLOOP-HTML-CONNECT:VERSION=' + OPENLOOP_HTML_CONNECT_VERSION + '}}',
		_liveSyncPath = '../sync/',
		_getVersion = () => {
			return parseOpenLoopFlag(_version).value;
		},
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
		}, true),
		_frameId = new Defaultable(null, defaultValue => {
			let frameId = getQueryString('frame_id');
			if (frameId === null) {
				// If frame_id is not found, fallback to player_id.
				frameId = getQueryString('player_id');
			}
			if (frameId === null) {
				if(defaultValue !== null) {
					frameId = defaultValue;
				} else {
					throw new ResourceNotFoundError('Frame id requested but not found! Make sure to open this page with "?frame_id=[yourFrameId]" on the query string.');
				}
			}
			return frameId;
		}),
		_isDebug = new Defaultable(false, () => (getQueryString('debug') !== null)),
		_isLive = new Defaultable(false, isLive),
		_feeds = {
			assets: new ArrayFeedsCollection(_syncPath, item => item['image_src']),
			freeTexts: new ArrayFeedsCollection(null, item => item['body']),
			json: new FeedsCollection()
		},
		_configLoader = new ConfigLoader(_configFile, configData => {
			_feeds.assets.setFeedsFromConfig(configData.openLoopConfig.images);
			_feeds.freeTexts.setFeedsFromConfig(configData.openLoopConfig['free_text']);
			_feeds.json.setFeedsFromConfig(configData.openLoopConfig.json);
		}),
		_load = (success, error) => {
			let promise = _configLoader
				.load()
				.then(() => {
					Defaultable.ready = true;
				});

			if (success) {
				promise = promise.then(success);
			}

			if (error) {
				promise = promise.catch(error);
			}

			return promise;
		},
		_reset = function () {
			// Just for testing purposes.
			Defaultable.ready = false;
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
		getVersion: _getVersion,
		getSyncPath: _syncPath.getValue,
		setSyncPath: _syncPath.setValue,
		setDefaultSyncPath: _syncPath.setDefault,
		setDefaultConfigFile: _configFile.setDefault,
		getFrameId: _frameId.getValue,
		setDefaultFrameId: _frameId.setDefault,
		isLive: _isLive.getValue,
		isDebug: _isDebug.getValue,
		feeds: _feeds,
		load: _load,
		reset: _reset,
		errors
	};
};

const singletonInstance = OpenLoopConnect();
module.exports = singletonInstance;

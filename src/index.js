require('es6-promise').polyfill();
import Defaultable from 'lib/Defaultable';
import {
	getQueryString,
	isLive,
	parseOpenLoopFlag,
	accessorFromOpenLoopFlag
} from 'lib/Utils';
import FeedsCollection from 'lib/FeedsCollection';
import ArrayFeedsCollection from 'lib/ArrayFeedsCollection';
import fetchJsonp from 'fetch-jsonp';
import ConfigLoader from 'lib/ConfigLoader';
import errors, { ResourceNotFoundError } from 'lib/Errors';

const OpenLoopConnect = () => {
	// OpenLoopConnect HTML5 SDK Library.
	var _openLoopSyncPath = '{{{OPENLOOP-HTML-CONNECT:SYNC-PATH}}}',
		_openLoopConfigFile = '{{{OPENLOOP-HTML-CONNECT:CONFIG-FILE}}}',
		_openLoopForceDefault = '{{{OPENLOOP-HTML-CONNECT:FORCE-DEFAULT}}}',
		_openLoopWidth = '{{{OPENLOOP-HTML-CONNECT:WIDTH}}}',
		_openLoopHeight = '{{{OPENLOOP-HTML-CONNECT:HEIGHT}}}',
		_openLoopBackgroundColor = '{{{OPENLOOP-HTML-CONNECT:BG-COLOR}}}',
		_openLoopLibraryVersion = '{{{OPENLOOP-HTML-CONNECT:VERSION=' + OPENLOOP_HTML_CONNECT_VERSION + '}}}',
		_openLoopPublisherVersion = '{{{OPENLOOP-HTML-CONNECT:PUBLISHER-VERSION}}}',
		_liveSyncPath = '../sync/',
		_configLoaded = false,
		_getVersion = () => {
			return parseOpenLoopFlag(_openLoopLibraryVersion).value;
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
		_configFile = new Defaultable(null, accessorFromOpenLoopFlag(_openLoopConfigFile), true),
		_forceDefault = new Defaultable(null, accessorFromOpenLoopFlag(_openLoopForceDefault)),
		_width = new Defaultable(null, accessorFromOpenLoopFlag(_openLoopWidth)),
		_height = new Defaultable(null, accessorFromOpenLoopFlag(_openLoopHeight)),
		_backgroundColor = new Defaultable(null, accessorFromOpenLoopFlag(_openLoopBackgroundColor)),
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
		_isConfigLoaded = () => _configLoaded,
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
				.then(configLoaded => {
					_configLoaded = configLoaded;
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
		getForceDefault: _forceDefault.getValue,
		setDefaultForceDefault: _forceDefault.setDefault,
		getWidth: _width.getValue,
		setDefaultWidth: _width.setDefault,
		getHeight: _height.getValue,
		setDefaultHeight: _height.setDefault,
		getBackgroundColor: _backgroundColor.getValue,
		setDefaultBackgroundColor: _backgroundColor.setDefault,
		isLive: _isLive.getValue,
		isDebug: _isDebug.getValue,
		isConfigLoaded: _isConfigLoaded,
		feeds: _feeds,
		load: _load,
		reset: _reset,
		errors
	};
};

const singletonInstance = OpenLoopConnect();
module.exports = singletonInstance;

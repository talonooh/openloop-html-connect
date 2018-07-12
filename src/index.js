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
	var _openLoopLibraryVersion = '{{{OPENLOOP-HTML-CONNECT:VERSION=' + OPENLOOP_HTML_CONNECT_VERSION + '}}}',
		_liveSyncPath = '../sync/',
		// ConfigLoaded: True after real ol config is successfully loaded.
		_configLoaded = false,
		// True after load.
		_readyToPlay = false,
		// True after player calls the 'PlayCallback', otherwise always true.
		_allowedToPlay = false,
		_onPlayListener = () => { },
		_getVersion = () => {
			return parseOpenLoopFlag(_openLoopLibraryVersion).value;
		},
		_syncPath = new Defaultable('./', accessorFromOpenLoopFlag('{{{OPENLOOP-HTML-CONNECT:SYNC-PATH}}}', value => value, defaultValue => {
			if (_isLive.getValue()) {
				return _liveSyncPath;
			} else {
				return defaultValue;
			}
		})),
		_configFile = new Defaultable(null, accessorFromOpenLoopFlag('{{{OPENLOOP-HTML-CONNECT:CONFIG-FILE}}}'), true),
		_playCallback = new Defaultable(null, accessorFromOpenLoopFlag('{{{OPENLOOP-HTML-CONNECT:PLAY-CALLBACK}}}'), true),
		_forceDefault = new Defaultable(null, null, false),
		_width = new Defaultable(null, accessorFromOpenLoopFlag('{{{OPENLOOP-HTML-CONNECT:WIDTH}}}'), true),
		_height = new Defaultable(null, accessorFromOpenLoopFlag('{{{OPENLOOP-HTML-CONNECT:HEIGHT}}}'), true),
		_backgroundColor = new Defaultable(null, accessorFromOpenLoopFlag('{{{OPENLOOP-HTML-CONNECT:BG-COLOR}}}'), true),
		_frameId = new Defaultable(null, defaultValue => {
			// Search for the frameId using sniffing approach.
			let frameId = null;
			if (typeof window.BroadSignObject !== 'undefined' && window.BroadSignObject.frame_id !== undefined) {
				frameId = window.BroadSignObject.frame_id;
			}
			if (frameId === null) {
				frameId = getQueryString('frame_id');
			}
			if (frameId === null) {
				// If frame_id is not found, fallback to player_id.
				frameId = getQueryString('player_id');
			}
			if (frameId === null) {
				if (defaultValue !== null) {
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
			_forceDefault.setValue(configData.openLoopConfig.config.showDefault === "true");
			_feeds.assets.setFeedsFromConfig(configData.openLoopConfig.images);
			_feeds.freeTexts.setFeedsFromConfig(configData.openLoopConfig['free_text']);
			_feeds.json.setFeedsFromConfig(configData.openLoopConfig.json);
		}),
		_load = (success, error) => {
			let promise = _configLoader
				.load()
				.then(configLoaded => {
					_configLoaded = configLoaded;
					if (!configLoaded) {
						return _feeds.json.loadDefaultFeedsFromFiles();
					}
				})
				.then(() => {
					Defaultable.ready = true;
				});

			if (success) {
				promise = promise.then(success);
			}

			promise = promise.then(() => {
				_readyToPlay = true;
				_play();
			});

			if (error) {
				promise = promise.catch(error);
			}
		},
		_onPlay = (listener) => {
			_onPlayListener = listener;
		},
		_play = () => {
			if (_readyToPlay && _allowedToPlay) {
				_onPlayListener();
			}
		},
		_setDefaultPlayCallback = (callbackName) => {
			_playCallback.setDefault(callbackName);
			_initializePlayCallback();
		},
		_initializePlayCallback = () => {
			/**
			 * Initialize library by setting from the begining the PlayCallback available on root scope.
			 */
			const playCallback = _playCallback.getValue();
			if (playCallback !== null && playCallback !== '') {
				_allowedToPlay = false;
				if (window[playCallback] === undefined) {
					window[playCallback] = () => {
						_allowedToPlay = true;
						_play();
					};
				}
			} else {
				_allowedToPlay = true;
			}
		},
		_reset = function () {
			// Just for testing purposes.
			Defaultable.ready = false;
			_configLoaded = false;
			_readyToPlay = false;
			_allowedToPlay = false;
			_onPlayListener = () => { };
			_syncPath.reset();
			_configFile.reset();
			_playCallback.reset();
			_forceDefault.reset();
			_width.reset();
			_height.reset();
			_backgroundColor.reset();
			_frameId.reset();
			_isDebug.reset();
			_isLive.reset();
			_feeds.assets.reset();
			_feeds.freeTexts.reset();
			_feeds.json.reset();
			_configLoader.reset();
			_initializePlayCallback();
		};

	_initializePlayCallback();

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
		setDefaultPlayCallback: _setDefaultPlayCallback,
		isLive: _isLive.getValue,
		isDebug: _isDebug.getValue,
		isConfigLoaded: _isConfigLoaded,
		feeds: _feeds,
		load: _load,
		onPlay: _onPlay,
		reset: _reset,
		errors
	};
};

const singletonInstance = OpenLoopConnect();
module.exports = singletonInstance;

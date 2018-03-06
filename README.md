# openloop-html-connect
**Your single HTML5 Creative -> OpenLoop -> All Media Owners -> Millions of Panels.**

HTML5 SDK for connecting OpenLoop with HTML Creatives with interfaces to simplify Media Owner integration for DOOH Dynamic Campaigns.

This library interface all you need for getting panel's information or campaign assets while the HTML5 creative is running on any Media Owner's panel.

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
    - [Creative using webpack](#creative-using-webpack)
    - [Quick sample](#quick-sample)
- [API](#api)
    - [load(success, error)](#loadsuccess-error)
    - [getSyncPath()](#getsyncpath)
    - [setDefaultSyncPath(syncPath)](#setdefaultsyncpathsyncpath)
    - [setSyncPath(syncPath)](#setsyncpathsyncpath)
    - [getFrameId()](#getframeid)
    - [isLive()](#islive)
    - [isDebug()](#isdebug)
    - [feeds.json](#feedsjson)
        - [feeds.json.getFeed(feedId)](#feedsjsongetfeedfeedid)
        - [feeds.json.addDefaultFeed(feedId, feedObject)](#feedsjsonadddefaultfeedfeedid-feedobject)
    - [feeds.freeTexts](#feedsfreetexts)
        - [feeds.freeTexts.getFeed(feedId)](#feedsfreetextsgetfeedfeedid)
        - [feeds.freeTexts.addDefaultFeed(feedId)](#feedsfreetextsadddefaultfeedfeedid)
    - [feeds.assets](#feedsassets)
        - [feeds.assets.getFeed(feedId)](#feedsassetsgetfeedfeedid)
        - [feeds.assets.addDefaultFeed(feedId)](#feedsassetsadddefaultfeedfeedid)
    - [errors](#errors)
        - [errors.OpenLoopHTMLConnectError](#errorsopenloophtmlconnecterror)
        - [errors.ResourceNotFoundError](#errorsresourcenotfounderror)
        - [errors.InvalidOperationError](#errorsinvalidoperationerror)
- [Ajax calls](#ajax-calls)
- [How it works](#how-it-works)
- [Browser compatibility](#browser-compatibility)
- [Support](#support)

# Installation
If you are using webpack or similar, install the library:

`npm install openloop-html-connect --save`

And require/import it on your project.

Or just copy the content on [index.js](index.js) and paste it on your creative.

# Usage
- **Download** or install this library from npm.
- **Implement your creative** using the library API.
	- **Import library** on your creative.
	- **Set defaults** for local testing using:
		- `setDefaultSyncPath`
		- `addDefaultFeed`
	- **Load** using `.load(success, error)`.
	- **Use getters** (inside sucess callback) to feed your creative using:
		- `getSyncPath`
		- `getFrameId`
		- `isLive`
		- `isDebug`
		- `feeds`
	- *IMPORTANT*: Do not use getters outside the sucess callback of the load method.
- **Go live**
	- **Upload creative and content** through OpenLoop or OpenLoop API.
	- OpenLoop will take care about how to modify the Creative in order to make it works on any Media Owner's panel.
	- Your creative will runs on a Media Owner's panel and when using the library methods, those methods will retrieve the correct information depending on the Media Owner and the feeds attached by OpenLoop.

# Examples

## Creative using webpack
You can see a complete creative example on:

[examples/creative-example](examples/creative-example)

 This is an example using this library and webpack for generating an unique HTML with everything self contained.

## Quick sample
```javascript
// Import or copy library. (e.g.: ES6 / TS using webpack).
import openLoopConnect from 'openloop-html-connect';

// Defaults for local testing on dev environment:
openLoopConnect.setDefaultSyncPath('../../myAssetsFolderOnDevEnvironment/');
openLoopConnect.feeds.assets.addDefaultFeed('cloudy')
	.addItem('cloudy.jpg');
openLoopConnect.feeds.json.addDefaultFeed('weather', {
	panels: [
		{ id: 123, status: 'cloudy' },
		{ id: 456, status: 'sunny' }
	]
});

// Initialization.
let imageToDisplay;

openLoopConnect.load(function () {
	// On success parsing config file or loading setted defaults.
	try {
		// Your logic depending on frame_id and parsing of feed data.
		let customFeed = openLoopConnect.feeds.json.getFeed('weather');
		let frameId = parseInt(openLoopConnect.getFrameId());
		// The following parse is based on your own feed json structure
		let panelWeatherData = customFeed.panels.find(panel => panel.id === frameId);
		let currentWeather = panelWeatherData.status;
		// Your logic depending on feed data.
		let imageToDisplay = openLoopConnect.feeds.assets.getFeed(currentWeather)[0];
	} catch (e) {
		// Error on creative logic.
		// e.g.: Feed not found, frameId not found, panel not found, etc..
		fallBackToEmbeddedDefaults();
	}

	renderContent();
}, function (e) {
	// On error loading/parsing Config file.
	fallBackToEmbeddedDefaults();
	renderContent();
});

function fallBackToEmbeddedDefaults() {
	imageToDisplay = 'blob:embeddedImage';
}

function renderContent() {
	// Assets getted from feeds.assets.getFeed, already contains syncPath as prefix.
	document.getElementById("myImageId").src = imageToDisplay;
}
```

# API

## load(success, error)
Returns a **Promise** so you can use it either through the `success` and `error` callbacks parameters or using `openLoopConnect.load().then(callback)` or `.catch` like any promise.

- `success` - Called if:
	- OpenLoop config file was loaded successfully
	- Config file is not setted so the library successfully fallbacks to the setted defaults.
- `error` - Called if OpenLoop sets that a config file needs to be loaded but the library failed to load or parse the config file.

We strongly recommend using the `error` callback or `.catch` to fallback to your own defaulting strategy (see example above).

**When to use it** - *Always:* this method is mandatory, make sure that any getter that you call should be called inside the sucess callback of this method.

**Why?** - Resolves if it necessary to load the OpenLoop config file or it can use the default values. If the OpenLoop config file is loaded it waits until load, parsing and set of new values is complete.

## getSyncPath()
Gets the current sync path.

You should use this path as suffix for any external asset you need to request as it may change depending on the Media Owner.

You do not need to use this if you are using `openLoopConnect.feeds.assets.getFeeds`, the assets retrieved by this method already prefix the file paths with this sync path.

If you are testing locally (without OpenLoop publishing process yet), this will automatically returns the content received on `setDefaultSyncPath`.

## setDefaultSyncPath(syncPath)
As all your requests should use `getSyncPath` as suffix, this methods allows you to set the current path while you are testing locally.

Your final creative can still calling this method as the default sync will not be used once OpenLoop process your creative.

## setSyncPath(syncPath)
You should **NEVER use this method** unless you are a Media Owner.

This method is reserved for Media Owner's players that can directly specify the sync path.

## getFrameId()
Gets the current frame id.

Depending on Media Owner there will be different ways to retrieve the frame id, so this methods provides you a single entry point to retrieve that.

While testing you can call your HTML with a query string with the frame_id.
```javascript
// accessing: myCampaign/index.html?frame_id=123
openLoopConnect.getFrameId() // will return "123".
```

## isLive()
Returns a boolean. True if it is accessing live (no offline sync).

## isDebug()
Returns a boolean. True if the debug flag is enabled.

While testing you can call your HTML with a query string with the debug flag.
```javascript
// accessing: myCampaign/index.html?frame_id=123&debug=1
openLoopConnect.isDebug() // will return true.
// ---
// accessing: myCampaign/index.html?frame_id=123
openLoopConnect.isDebug() // will return false
```

## feeds.json
### feeds.json.getFeed(feedId)
Retrieves the json feed by id. Returns the object resulting on parsing the original JSON feed embedded by OpenLoop, or the feedObject defined by `feeds.json.addDefaultFeed`.

### feeds.json.addDefaultFeed(feedId, feedObject)
Adds a default feed with the given id and the feedObject.

## feeds.freeTexts
### feeds.freeTexts.getFeed(feedId)
Retrieves the free texts feed by id. Returns an array of strings which are the free texts defined and embedded by OpenLoop, or the items defined by `feeds.freeTexts.addDefaultFeed` and `addItem`.

### feeds.freeTexts.addDefaultFeed(feedId)
Adds a default feed with the given id. Then this feed can be filled using the `addItem(item)` method using chaining pattern like the following example.
```javascript
openLoopConnect.feeds.freeTexts.addDefaultFeed('cloudy')
	.addItem('Today is cloudy')
	.addItem('Today is overcast');
```
## feeds.assets
### feeds.assets.getFeed(feedId)
Retrieves the assets feed by id. Returns an array of strings which are the asset's paths uploaded and embedded by OpenLoop, or the items defined by `feeds.assets.addDefaultFeed` and `addItem`.

*Note:* Those assets paths already contains the sync path as prefix of the asset path.

### feeds.assets.addDefaultFeed(feedId)
Adds a default feed with the given id. Then this feed can be filled using the `addItem(item)` method using chaining pattern like the following example.
```javascript
openLoopConnect.feeds.assets.addDefaultFeed('cloudy')
	.addItem('cloudy.jpg')
	.addItem('cloudy.mp4');
```

## errors
The connect library also expose a set of custom error types that can be usefull for error handling on the creative like the following example.
```javascript
try {
	openLoopConnect.feeds.json.getFeed('weather')
} catch(e) {
	if(e instanceof openLoopConnect.errors.ResourceNotFoundError) {
		// do something if feed was not found.
	}
}
```

### errors.OpenLoopHTMLConnectError
All the errors that this library throws, inherits from this error type.

### errors.ResourceNotFoundError
Thrown when:
- `getFrameId` was called but is not setted on query string.
- `getFeed` was called but the requested feed was not found.

### errors.InvalidOperationError
Thrown when any getter was called outside the sucess callback of the `.load` method.

# Ajax calls
We strongly disencourage the usage of ajax calls because they will not work on an offline panel. Internally the SDK and OpenLoop use JSONP (using script tags) to send data to the creative.

If you want to attach API feeds (social network, traffic, weather, custom, etc..) so the creative can have that information, please add this feeds on the OpenLoop configuration and OpenLoop will make sure that the feeds will be attached to the **OpenLoop config file** and so the creative can load this data through this SDK library (see example above).

If despite this warning you still want to make ajax calls, please make sure that your campaign will not run offline and the panel's Media Owner allows you to make external calls.

# How it works
- The library contains some placeholders for parameters that can be defined by OpenLoop.
- OpenLoop process the Creative on the Publishing process, on this process it will search for this library inside your Creative and modify those placeholders with the correct information for the targeted Media Owner.
- The library API methods, internally checks the existence of some parameters that can be defined by OpenLoop.
- If those parameters are setted the library returns those values, if not, the library will fallback for the default values that you can also define on the development stage.
- Some parameters like feeds, are setted on the **OpenLoop config file**, this file will be automatically loaded defining the correct values for the feeds in the presence of a flag setted by OpenLoop on the publishing stage.

# Browser compatibility
This library was successfully tested on:
- IE 11
- Microsoft Edge 40
- Chrome 64
- Firefox 58

# Support
Please contact with [QDOT](http://q.media/).

We will be glad to support you on integrating with OpenLoop.

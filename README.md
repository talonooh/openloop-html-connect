# openloop-html-connect
**Your single HTML5 Creative -> OpenLoop -> All Media Owners -> Millions of Panels.**

HTML5 SDK for connecting OpenLoop with HTML Creatives with interfaces to simplify Media Owner integration for DOOH Dynamic Campaigns.

This library interface all you need for getting panel's information or campaign assets while the HTML5 creative is running on any Media Owner's panel.

# Installation
If you are using webpack or similar, install the library:

`npm install openloop-html-connect --save`

And require/import it on your project.

Or just copy the content on [index.js](index.js) and paste it on your creative.

# Example
```javascript
// Import or copy library. (e.g.: ES6 / TS using webpack).
import openLoopConnect from 'openloop-html-connect';

// For testing on dev environment setDefaultSyncPath.
openLoopConnect.setDefaultSyncPath('c://myAssetsFolderOnDevEnvironment/');

// Your logic depending on frameId.
let imageToDisplay;
switch(openLoopConnect.getFrameId()) {
        case '32987473':
                imageToDisplay = 'summer.jpg';
        case '2387445':
                imageToDisplay = 'winter.jpg';
        default:
                imageToDisplay = 'allSeasons.jpg';
}

// Your logic depending on assets path.
document.getElementById("myImageId").src = openLoopConnect.getSyncPath() + imageToDisplay;
```

# API

## getSyncPath()
Gets the current sync path. 

You should use this path as suffix for any external asset you need to request as it may change depending on the Media Owner.

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
// accessing: myCampaign/index.html?frame_id=12345
openLoopConnect.getFrameId() // will return "12345".
```

## isLive()
Returns a boolean. True if it is accessing live (no offline sync).

## isDebug()
Returns a boolean. True if the debug flag is enabled.

While testing you can call your HTML with a query string with the debug flag.
```javascript
// accessing: myCampaign/index.html?frame_id=12345&debug=1
openLoopConnect.isDebug() // will return true.
// ---
// accessing: myCampaign/index.html?frame_id=12345
openLoopConnect.isDebug() // will return false
```

# Workflow
- Download or install this library from npm.
- Implement your creative using the library API (e.g.: Using `getFrameId` to know the panel's id and decide what to display or use `getSyncPath` to know where to find external assets).
- Use `setDefaultSyncPath` to set your local assets path while your are testing your creative on your dev environment.
- Upload content through OpenLoop or OpenLoop API.
- OpenLoop will take care about how to modify the Creative in order to make it works on any Media Owner's panel.
- Your creative will runs on a Media Owner's panel and when using the library methods, those methods will retrieve the correct information depending on the Media Owner.

# How it works
- The library contains some placeholders for parameters that can be defined by OpenLoop.
- OpenLoop process the Creative on the Publishing process, on this process it will search for this library inside your Creative and modify those placeholders with the correct information for the targeted Media Owner.
- The library API methods, internally checks the existence of some parameters that can be defined by OpenLoop.
- If those parameters are setted the library returns those values, if not, the library will fallback for the default values that you can also define on the development stage.

# Support
Please contact with [QDOT](http://q.media/).

We will be glad to support you on integrating with OpenLoop.

import Defaultable from "./Defaultable";

export default class FeedsCollection {
	constructor(accessor = null) {
		this.feedCollection = new Defaultable({}, accessor);
	}

	setFeeds(data) {
		console.log(data.data);
		// TODO: Dynamically parse one/multiple feeds, and set feedId from feed.@id.
		this.feedCollection.setValue({
			weather: data.data
		});
	}

	getFeed(feedId) {
		const feed = this.feedCollection.getValue()[feedId];
		if(feed === undefined) {
			console.log('Feed requested but not found: ' + feedId);
			return null;
		}
		return this.feedCollection.getValue()[feedId];
	}

	addDefaultFeed(feedId, feedData) {
		this.feedCollection.default[feedId] = feedData;
	}

	reset() {
		this.feedCollection.reset();
	}
}

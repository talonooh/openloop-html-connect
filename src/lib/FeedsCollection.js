import Defaultable from "./Defaultable";
import { readJSONPCollection } from './Utils';

export default class FeedsCollection {
	constructor() {
		this.feedCollection = new Defaultable({});
	}

	setFeedsFromConfig(configData) {
		const data = (configData && configData.data) ?
			readJSONPCollection(configData.data) : {};

		this.feedCollection.setValue(data);
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

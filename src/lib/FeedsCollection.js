import Defaultable from "./Defaultable";
import { readJSONPCollection } from './Utils';
import { ResourceNotFoundError } from './Errors';

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
			throw new ResourceNotFoundError('Feed id "' + feedId + '" was requested but not found.');
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

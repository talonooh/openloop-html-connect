import FeedsCollection from "./FeedsCollection";
import ArrayFeed from "./ArrayFeed";
import { readJSONPCollection } from './Utils';

export default class ArrayFeedsCollection extends FeedsCollection {
	constructor(syncPath = null, itemMapper = null) {
		super();
		this.itemMapper = itemMapper;
		this.syncPath = syncPath;
	}

	setFeedsFromConfig(configData) {
		const data = (configData && configData.data) ?
			readJSONPCollection(configData.data, feed => {
				const item = new ArrayFeed(this.itemMapper);
				item.setItemsFromConfig(feed.item)
				return item;
			}) : {};

		this.feedCollection.setValue(data);
	}

	getFeed(feedId) {
		const feed = super
			.getFeed(feedId);

		if(feed === null) {
			return null;
		}

		return feed
			.getItems()
			.map(item => (this.syncPath) ? this.syncPath.getValue() + item : item);
	}

	addDefaultFeed(feedId) {
		const newFeed = new ArrayFeed();
		super.addDefaultFeed(feedId, newFeed);
		return newFeed;
	}
}

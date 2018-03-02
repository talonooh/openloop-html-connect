import FeedsCollection from "./FeedsCollection";
import ArrayFeed from "./ArrayFeed";

export default class ArrayFeedsCollection extends FeedsCollection {
	constructor(syncPath = null, accessor = null) {
		super(accessor);
		this.syncPath = syncPath;
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

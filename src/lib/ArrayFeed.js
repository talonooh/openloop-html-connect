import { readJSONPArray } from './Utils';

export default class ArrayFeed {
	constructor(itemMapper = null) {
		this.itemMapper = itemMapper;
		this.items = [];
	}

	setItemsFromConfig(configData) {
		this.items = readJSONPArray(configData, this.itemMapper);
	}

	addItem(item) {
		this.items.push(item);
		return this;
	}

	getItems() {
		return this.items;
	}
}

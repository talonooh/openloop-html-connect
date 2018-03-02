export default class ArrayFeed {
	constructor() {
		this.items = [];
	}

	addItem(item) {
		this.items.push(item);
		return this;
	}

	getItems() {
		return this.items;
	}
}

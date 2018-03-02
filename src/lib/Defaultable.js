import clone from 'clone';

export default class Defaultable {
	constructor(initial, accessor = null) {
		this.initial = initial;
		this.accessor = accessor;
		this.reset();

		this.setDefault = this.setDefault.bind(this);
		this.setValue = this.setValue.bind(this);
		this.getValue = this.getValue.bind(this);
		this.reset = this.reset.bind(this);
	}

	setDefault(defaultValue) {
		this.default = defaultValue;
	}

	setValue(value) {
		this.value = value;
	}

	getValue() {
		if (this.value === null) {
			if (this.accessor !== null) {
				this.setValue(this.accessor(this.default));
			} else {
				this.setValue(this.default);
			}
		}

		return this.value;
	}

	reset() {
		this.value = null;
		this.default = clone(this.initial);
	}
}

import clone from 'clone';
import { InvalidOperationError } from './Errors';

export default class Defaultable {
	constructor(initial, accessor = null, allowReadBeforeLoad = false) {
		this.initial = initial;
		this.accessor = accessor;
		this.allowReadBeforeLoad = allowReadBeforeLoad;
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
		if(!Defaultable.ready && !this.allowReadBeforeLoad) {
			throw new InvalidOperationError('Trying to read a property before loading. Please read properties inside openLoopConnect.load(() => { this callback });');
		}

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

Object.defineProperty(Defaultable, 'ready', {
    value: false,
    writable : true,
    enumerable : true,
    configurable : true
});

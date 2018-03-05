import { jsonpLoader } from 'lib/Utils';
import { ConfigFileError } from 'lib/Errors';

export default class ConfigLoader {
	constructor(configFile, accessor) {
		this.accessor = accessor;
		this.configFile = configFile;
		this.promise = null;

		this.load = this.load.bind(this);
	}

	reset() {
		this.promise = null;
	}

	loadConfig() {
		return new Promise(resolve => {
			const configFile = this.configFile.getValue();
			if (configFile !== null) {
				jsonpLoader(configFile)
				.then(json => {
					this.accessor(json);
					resolve();
				}).catch(ex => {
					throw new ConfigFileError('Invalid configuration JSON file. Unable to parse.');
					resolve();
				});
			} else {
				resolve();
			}
		});
	}

	load(callback) {
		if (this.promise === null) {
			this.promise = this.loadConfig();
		}

		return (callback) ? this.promise.then(callback) : this.promise;
	}
}
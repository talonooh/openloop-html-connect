import { jsonpLoader } from 'lib/Utils';

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
		return new Promise((resolve, reject) => {
			const configFile = this.configFile.getValue();
			if (configFile !== null) {
				jsonpLoader(configFile)
				.then(json => {
					this.accessor(json);
					resolve(true);
				}).catch(ex => {
					reject('[OpenLoopHTMLConnect] [ConfigFile] Configuration JSON file setted but invalid or not found.');
				});
			} else {
				// force to go to next stack.
				setTimeout(() => {
					resolve(false);
				}, 0);
			}
		});
	}

	load() {
		if (this.promise === null) {
			this.promise = this.loadConfig();
		}

		return this.promise;
	}
}

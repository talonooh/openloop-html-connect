const fs = require('fs');

const fetch = (url) => {
	return new Promise(resolveA => {
		fs.readFile(url, 'utf8', (error, data) => {
			resolveA({
				json: () => {
					return new Promise(resolveB => {
						resolveB(JSON.parse(data));
					});
				}
			});
		});
	});
}

global.fetch = fetch;

module.exports = fetch;

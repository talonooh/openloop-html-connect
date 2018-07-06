import fetchJsonp from 'fetch-jsonp';

/**
 * Searches for a field on the given URL or on the browser's nav bar URL (default).
 * If the fields is found, it returns the value, else will return null.
 * from: https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
 * @param string field
 * @param string (optional) url
 * @returns Value of the fields or null if the field does not exist on the given url.
 */
export const getQueryString = (field, url) => {
	let href = url ? url : window.location.href,
		reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i'),
		string = reg.exec(href);
	return string ? string[1] : null;
};

/**
 * Reads browsers nav bar URL to determine
 * if it is running live under OpenLoop's domains.
 */
export const isLive = () => {
	const regex = RegExp(/^https\:\/\/(?:[\w_-]\.?)*openloop(?:\.q)?\.(?:media|it)/);
	return regex.test(window.location.href);
};

/**
 * A util that parses key and value of an OpenLoop flag e.g.: {{OPENLOOP-HTML-CONNECT:VERSION=1.0.0}}
 * @param string flag
 * @return { key, value } An object with key and value of the flag.
 */
export const parseOpenLoopFlag = (flag) => {
	const regex = RegExp(/^\{\{\{OPENLOOP-HTML-CONNECT:(\w+)=([\w.]+)\}\}\}$/);
	const match = flag.match(regex);
	if (match === null) {
		return null;
	}

	return {
		key: match[1],
		value: match[2]
	};
}

/**
 * Defaultable accessor that automatically checks if the flag is setted.
 * If it is setted returns the flag value, otherwise will return the default value.
 * @param string flag
 */
export const accessorFromOpenLoopFlag = (flag, accessor = value => value, defaultAccessor = defaultValue => defaultValue) => defaultValue => {
	if (flag.indexOf('OPENLOOP-HTML-CONNECT') === -1) {
		return accessor(flag);
	} else {
		return defaultAccessor(defaultValue);
	}
}

/**
 * OpenLoop config may contain array feeds or single item feeds.
 * The XML to JSON may change the structure of the resulting JSON
 * depending if the element contains multiple or single children.
 * This function resolves this by creating an object with all the items
 * or with the unique item, also it format the object using
 * the @id to name the children as parent's property.
 * @param {*} data OpenLoop config partial item.
 * @param {function} itemMapper (Optional) Function that receives the item and should return the mapped object.
 * @returns {*} Formatted and standard JSON with all data parsed.
 */
export const readJSONPCollection = (configArrayData, itemMapper = null) => {
	let data = {};
	if (configArrayData) {
		if (Array.isArray(configArrayData)) {
			configArrayData.forEach(item => {
				const id = item['@id'];
				data[id] = (itemMapper) ? itemMapper(item) : item.data;
			});
		} else if (typeof configArrayData === 'object') {
			const item = configArrayData;
			const id = item['@id'];
			data[id] = (itemMapper) ? itemMapper(item) : item.data;
		}
	}
	return data;
};

/**
 * Same as readJSONPCollection but generates an array where ids doesn't matter, just the array order.
 * @param {*} data OpenLoop config partial item.
 * @param {function} itemMapper (Optional) Function that receives the item and should return the mapped object.
 * @returns Array Array with all data parsed.
 */
export const readJSONPArray = (configArrayData, itemMapper = null) => {
	let data = [];
	if (configArrayData) {
		if (Array.isArray(configArrayData)) {
			configArrayData.forEach(item => {
				const newItem = (itemMapper) ? itemMapper(item) : item.data;
				data.push(newItem);
			});
		} else if (typeof configArrayData === 'object') {
			const newItem = (itemMapper) ? itemMapper(configArrayData) : configArrayData.data;
			data.push(newItem);
		}
	}
	return data;
};

/**
 * On a Browser, given an URL, reads the JSONP and returns the JSON data.
 * @param {*} url
 * @return {*} Parsed JSON object.
 */
const webJsonpLoader = (url) => {
	return fetchJsonp(url, {
		jsonpCallbackFunction: 'openLoopConfig',
		timeout: 2000,
	}).then(function (response) {
		return response.json();
	});
}

/**
 * On NodeJS, given an URL, reads the JSONP and returns the JSON data.
 * 'nodeJsonP' library is provided from jest mock injection using global.
 * @param {*} url
 * @return {*} Parsed JSON object.
 */
const nodeJsonpLoader = (url) => {
	return nodeJsonp(url);
}

/**
 * Given an URL, reads the JSONP and returns the JSON data.
 * By default loads a JSONP loader for the Browsers,
 * but automatically fallbacks to NodeJS JsonP loader if "document" is not present.
 * @param {*} url
 * @return {*} Parsed JSON object.
 */
export const jsonpLoader = (url) => {
	var loader = (typeof global !== 'undefined' && typeof global.nodeJsonp !== 'undefined') ? global.nodeJsonp : webJsonpLoader;
	return loader(url);
};

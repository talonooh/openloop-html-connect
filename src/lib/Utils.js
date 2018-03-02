import fetchJsonp from 'fetch-jsonp';

export const getQueryString = (field, url) => {
	// from: https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
	let href = url ? url : window.location.href,
		reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i'),
		string = reg.exec(href);
	return string ? string[1] : null;
};

export const isLive = () => {
	const regex = RegExp(/^https\:\/\/(?:[\w_-]\.?)*openloop(?:\.q)?\.(?:media|it)/);
	return regex.test(window.location.href);
};

const webJsonpLoader = (url) => {
	console.log('nodeJSONP')
	return fetchJsonp(url, {
		jsonpCallbackFunction: 'openLoopConfig'
	}).then(function (response) {
		return response.json();
	});
}

const nodeJsonpLoader = (url) => {
	// nodeJsonP provided from jest mock injection using global.
	return nodeJsonp(url);
}

export const jsonpLoader = (typeof document === 'undefined') ? nodeJsonpLoader : webJsonpLoader;

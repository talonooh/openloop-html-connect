export class OpenLoopHTMLConnectError extends Error {
	constructor(message) {
		if(console && console.log && typeof expect === 'undefined') {
			// Log error messages despite catches on the creative
			// to allow MediaOwner to debug when integrating.
			console.log('[OpenLoopHTMLConnect] ' + message);
		}
		super('[OpenLoopHTMLConnect] ' + message);
	}
}

export class ResourceNotFoundError extends OpenLoopHTMLConnectError {
	constructor(message) {
		super('[ResourceNotFoundError] ' + message);
	}
}

export class InvalidOperationError extends OpenLoopHTMLConnectError {
	constructor(message) {
		super('[InvalidOperationError] ' + message);
	}
}

export default {
	OpenLoopHTMLConnectError,
	ResourceNotFoundError,
	InvalidOperationError
};

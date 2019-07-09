var VERSION = "1.0";
var SCALA_PLAYER_SUPPORTED = "TRUE";
var SCALA_UNDEFINED = "&lt;undefined&gt;";
var LOCATION_METADATA_NAME = "Player.PlayerName";

var query = parseQueryString();
var metadata = isStringNullOrEmpty(query.metadata) ? {} : parseQueryString(query.metadata);

/** Requests the current library version number
 * @returns {string} Version number in Major.Minor format
 */
exports.version = function () {
	return VERSION;
};

/** Determines whether the content is being run within a Scala browser environment
 * @returns {boolean} true if with Scala, false if not
 */
exports.inScala = function () {
	return window.ScalaPlayer === SCALA_PLAYER_SUPPORTED;
};

/** Requests the value of a named Scala metadata value
 * @param {string} name Metadata variable name to lookup
 * @returns {*|null} Metadata value, or null if not found
 * @description Custom metadata specified in the metadata query param overrides system level values
 */
exports.getMetadataValue = function (name) {
	var value = metadata[name];

	if ((value === undefined) && exports.inScala &&
		isFunction(window.ScalaGetMetadataValue)) {
		try { // Scala Player's embedded browser
			value = window.ScalaGetMetadataValue(name);
			if (value === SCALA_UNDEFINED) { value = null; }
		} catch (e) {
			console.error("Scala Player Metadata not available", e);
		}
	}

	return (value === undefined) ? null : value;
};

/** Request the location ID for the local player
 * @returns {string} Location ID, or undefined if not specified
 * @description for testing, custom metadata can be specified using the metadata query param e.g:
 * index.html?metadata=Player.PlayerName%3Dtest
 */
exports.getLocationId = function () {
	return exports.getMetadataValue(LOCATION_METADATA_NAME);
};

/** Split a query string into a property map
 * @param {string} [str] - Query string (if not specified, will use current document location)
 * @returns {Object<string, string|string[]>} - Property map
 */
function parseQueryString(str) {
	if (isStringNullOrEmpty(str)) {
		var queryPos = window.location.href.indexOf("?");
		if (queryPos < 0) { return {}; }
		str = window.location.href.substr(queryPos + 1);
	}

	return str.split("&")
		.reduce(function (qs, keyValue) {
			var name, value, eqPos = keyValue.indexOf("=");

			if (eqPos > 0) {
				name = keyValue.substr(0, eqPos);
				value = decodeURIComponent(keyValue.substr(eqPos + 1));
			} else {
				name = keyValue;
				value = true;
			}

			name = decodeURIComponent(name);

			if (!isStringNullOrEmpty(name)) {
				if (qs[name] === undefined) {
					qs[name] = value;
				} else if (isArray(qs[name])) {
					qs[name].push(value);
				} else {
					qs[name] = [qs[name], value];
				}
			}

			return qs;
		}, {});
}

function isStringNullOrEmpty(str) {
	return (typeof (str) !== "string") || (str.length === 0);
}

function isFunction(val) {
	return typeof (val) === "function";
}

function isArray(val) {
	return isFunction(Array.isArray) ?
		Array.isArray(val) :
		val instanceof Array;
}

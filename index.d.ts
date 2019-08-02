declare module 'openloop-html-connect' {
	export class ArrayFeed {
		addItem: (itemPath: string, object?: JSON) => ArrayFeed;
		getItems: () => Array<string>;
	}

	export class ArrayFeedCollection extends FeedsCollection {
		addDefaultFeed: (feedId: string) => ArrayFeed;
		getFeed: (feedId: string) => Array<string>;
	}

	export class FeedsCollection {
		setFeedsFromConfig: (configData: JSON | XMLDocument) => void;
		getFeed: (feedId: string) => Array<ArrayFeed> | Array<string>;
		addDefaultFeed: (feedId: string, feedData: any) => ArrayFeed;
		addDefaultFeedFromFile: (feedId: string, filePath: string) => void;
		loadDefaultFeedsFromFiles: () => Promise<unknown>;
		reset: () => void;
	}

	export const getVersion: () => string;
	export const getSyncPath: () => string;
	export const setSyncPath: (path: string) => void;
	export const setDefaultSyncPath: (syncPath: string) => void;
	export const setDefaultConfigFile: (configPath: string) => void;
	export const getFrameId: () => string;
	export const getPlayerId: () => string;
	export const setDefaultFrameId: (frameId: string) => void;
	export const setDefaultPlayerId: (playerId: string) => void;
	export const getForceDefault: () => boolean;
	export const setDefaultForceDefault: (flag: boolean) => void;
	export const getWidth: () => number;
	export const setDefaultWidth: (width: number) => void;
	export const getHeight: () => number;
	export const setDefaultHeight: (width: number) => void;
	export const getBackgroundColor: () => string;
	export const setDefaultBackgroundColor: (color: string) => void;
	export const setDefaultPlayCallback: (callback: () => void) => void;
	export const getLastPublishedDate: () => Date;
	export const setDefaultLastPublishedDate: (date: Date) => void;
	export const isPublishedAfter: (date: Date) => boolean;
	export const isLive: () => boolean;
	export const isDebug: () => boolean;
	export const isConfigLoaded: () => boolean;
	export const load: (successCallback: () => void, errorCallback: (e: Error) => void) => void;
	export const onPlay: (callback: () => void) => void;
	export const play: () => void;
	export const reset: () => void;
	export const feeds: {
		assets: ArrayFeedCollection;
		freeTexts: ArrayFeedCollection;
		json: FeedsCollection
	};
	export const setDefaultLastPublishedDate: (timestamp: number) => void;
	export const getLastPublishedDate: () => number;
	export const scalaLib: {
		inScala: () => boolean;
		getMetadataValue: (value: string) => string;
		getLocationId: () => string;
	}
}

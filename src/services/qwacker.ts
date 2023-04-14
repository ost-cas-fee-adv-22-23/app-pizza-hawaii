import { TRawPost, TRawUser } from '../types';

export type TFetchBase = {
	accessToken?: string;
};
export type TFetchQuery =
	| {
			text?: string;
			tags?: string[];
			mentions?: string[];
			isReply?: boolean;
			likedBy?: string[];
	  }
	| {
			newerThan?: string;
			olderThan?: string;
			limit?: number;
			offset?: number;
			creator?: string;
	  };

type TFetchParams = TFetchBase & {
	endpoint: string;
	method: string;
	body?: FormData;
	headers: Record<string, string>;
} & TFetchQuery;

type TFetchListParams = TFetchBase &
	TFetchParams & {
		offset?: number;
		limit?: number;
		newerThan?: string;
		olderThan?: string;
	};
export type TFetchListResultPagination = {
	next?: string | TFetchQuery;
	previous?: string | TFetchQuery;
};
type TFetchListResult =
	| boolean
	| {
			count: number;
			items: TRawPost[] | TRawUser[];
			pagination: TFetchListResultPagination;
	  };

// TODO: remove this when the API is tested

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let counter = 0;
const BASE_URL = process.env.NEXT_PUBLIC_QWACKER_API_URL;

export async function fetchList(params: object): Promise<TFetchListResult> {
	const maxLimit = 1000;

	const { endpoint, accessToken, method, ...searchParams } = params as {
		endpoint: string;
		accessToken: string;
		method: string;
	} & TFetchListParams;

	let url = generateAPIUrl(endpoint);

	let fetchParams: Record<string, unknown> = {
		method,
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	};

	if (method === 'GET') {
		url = generateAPIUrl(endpoint, {
			limit: searchParams.limit ? Math.min(searchParams.limit, maxLimit) : undefined,
			...searchParams,
		});
	} else if (method === 'POST') {
		fetchParams = {
			...fetchParams,
			headers: searchParams?.headers || fetchParams.headers,
			body: searchParams?.body || JSON.stringify(searchParams),
		};
	}

	let remainingCount = 0;
	const allItems = [];
	let pagination = {};

	while (url) {
		// TODO: remove this when the API is tested
		// eslint-disable-next-line no-console
		console.log(`[${counter++}] Fetching ${url}...`);
		const response = await fetch(ensureHttpsProtocol(url), {
			...fetchParams,
		});

		if (!response.ok) {
			throw new Error(`Qwacker API request failed with status ${response.status} (${response.statusText})`);
		}

		if (response.status === 204) {
			return true;
		}

		const json = await response.json();

		allItems.push(...json.data);
		remainingCount = json.count - json.data.length;

		// update the pagination object
		pagination = {
			next: json.next,
			prev: json.prev,
		};

		// if there is no next page, stop fetching
		if (!json.next) {
			break;
		}

		// if a limit is set and the limit is reached, stop fetching
		if (searchParams.limit && allItems.length >= searchParams.limit) {
			break;
		}

		// set the next url or params for the next fetch
		if (typeof json.next === 'string') {
			url = json.next;
		} else {
			fetchParams = {
				...fetchParams,
				...json.next,
			};
		}
	}

	return {
		count: remainingCount,
		items: allItems,
		pagination,
	};
}

export async function fetchItem(params: object) {
	const { endpoint, accessToken, method, ...searchParams } = params as {
		endpoint: string;
		accessToken: string;
		method: string;
		searchParams?: TFetchQuery;
	} & TFetchParams;

	let url = generateAPIUrl(endpoint);

	let fetchParams: Record<string, unknown> = {
		method,
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	};

	if (method === 'GET') {
		url = generateAPIUrl(endpoint, {
			...searchParams,
		});
	} else if (method === 'POST') {
		fetchParams = {
			...fetchParams,
			headers: searchParams?.headers || fetchParams.headers,
			body: searchParams?.body || JSON.stringify(searchParams),
		};
	}

	// TODO: remove this when the API is tested
	// eslint-disable-next-line no-console
	console.log(`[${counter++}] Fetching ${url}...`);

	const response = await fetch(ensureHttpsProtocol(url), {
		...fetchParams,
	});

	if (!response.ok) {
		throw new Error(`Qwacker API request failed with status ${response.status} (${response.statusText})`);
	}

	if (response.status === 204) {
		return true;
	}

	return await response.json();
}

/**
 * Helper functions
 */

export function generateAPIUrl(endpoint: string, params?: TFetchQuery): string {
	let url = `${BASE_URL}${endpoint}`;

	if (params) {
		url = addUrlParams(url, params as TAddUrlParams);
	}

	return url;
}

type TAddUrlParams = {
	[key: string]: string | number | undefined;
};
// add url params to a url
export function addUrlParams(url: string, params: TAddUrlParams): string {
	// filter all undefined or null params
	Object.keys(params).forEach((key: string) => {
		if (params[key] === undefined || params[key] === null) {
			delete params[key];
		}
	});

	// convert all GET params to a string
	const getParamsStr = Object.entries(params).reduce((acc: { [key: string]: string }, [key, value]) => {
		acc[key] = String(value);
		return acc;
	}, {});

	// convert the params to a URLSearchParams object
	const searchParams = new URLSearchParams(getParamsStr);

	// generate a new URL object
	const urlObj = new URL(url);

	// add the search params to the URL object
	urlObj.search = urlObj.search ? `${urlObj.search}&${searchParams}` : `${searchParams}`;

	return urlObj.toString();
}

// ensure that the url is using https
export function ensureHttpsProtocol(url: string): string {
	if (url.startsWith('//')) {
		return `https:${url}`;
	}

	return url;
}

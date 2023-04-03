export type TBase = {
	accessToken: string;
};
const statusMessageMap: Record<number, string> = {
	204: 'No Content',
	401: 'Unauthorized',
	403: 'Forbidden',
};
let counter = 0;
const BASE_URL = process.env.NEXT_PUBLIC_QWACKER_API_URL;

export function generateAPIUrl(endpoint: string, params?: Record<string, unknown>): string {
	let url = `${BASE_URL}${endpoint}`;

	if (params) {
		url = addUrlParams(url, params);
	}

	return url;
}

export function addUrlParams(url: string, params: Record<string, unknown>): string {
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

export function ensureHttpsProtocol(url: string): string {
	if (url.startsWith('//')) {
		return `https:${url}`;
	}

	return url;
}

type TFetchSearchParams = TBase & {
	endpoint: string;
	method: string;

	text?: string;
	tags?: string[];
	mentions?: string[];
	isReply?: boolean;
	offset?: number;
	limit?: number;
	likedBy?: string[];

	body?: FormData;
	headers: Record<string, string>;
};

export async function fetchList(params: object) {
	const maxLimit = 1000;

	const { endpoint, accessToken, method, ...searchParams } = params as {
		endpoint: string;
		accessToken: string;
		method: string;
	} & TFetchSearchParams;

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
			limit: searchParams.limit ? Math.min(searchParams.limit, maxLimit) : undefined,
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

	while (url) {
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

		// if there is no next page, stop fetching
		if (!json.next) {
			break;
		}

		// if a limit is set and the limit is reached, stop fetching
		if (searchParams.limit && allItems.length >= searchParams.limit) {
			break;
		}

		// set the next url
		url = json.next;
	}

	return {
		count: remainingCount,
		items: allItems,
	};
}

export async function fetchItem(params: object) {
	const { endpoint, accessToken, method, ...searchParams } = params as {
		endpoint: string;
		accessToken: string;
		method: string;
	} & TFetchSearchParams;

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

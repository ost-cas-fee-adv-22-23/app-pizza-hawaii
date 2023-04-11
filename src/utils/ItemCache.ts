type TItemCacheCache<T> = Record<string, TItemCacheEntry<T>>;

type TItemCacheEntry<T> = {
	createdAt: number;
	data: T;
};

export class ItemCache<T> {
	private readonly cache: TItemCacheCache<T> = {};
	private readonly ttl: number;

	constructor(ttl: number) {
		this.ttl = ttl;
	}

	add(item: T & { id: string }): void {
		this.cache[item.id] = {
			createdAt: Date.now(),
			data: item,
		};
	}

	remove(id: string): void {
		delete this.cache[id];
	}

	get(id: string): T | false {
		const cacheEntry = this.cache[id];

		// Check if user is already in cache otherwise return false
		if (!cacheEntry) return false;

		// Check if cache entry is expired - if it is, remove it from the cache and return false
		const isExpired = Date.now() - cacheEntry.createdAt > this.ttl;
		if (isExpired) {
			delete this.cache[id];
			return false;
		}

		// Return cached data
		return cacheEntry.data;
	}
}

import { TPost } from '../../types';

type TGetPostResult = {
	count: number;
	posts: TPost[];
};

type TGetPost = {
	limit?: number;
	olderThan?: string;
	newerThan?: string;
};

export const loadmorePosts = async ({ olderThan, newerThan }: TGetPost): Promise<TGetPostResult> => {
	// create url params
	const urlParams = new URLSearchParams();

	if (olderThan !== undefined) {
		urlParams.set('olderThan', olderThan);
	}

	if (newerThan !== undefined) {
		urlParams.set('newerThan', newerThan);
	}

	const res = await fetch(`api/posts/loadmore?${urlParams}`);
	return (await res.json()) as TGetPostResult;
};

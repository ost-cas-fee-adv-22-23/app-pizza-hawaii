const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

type TGetPost = {
	id: string;
};

export const remove = async ({ id }: TGetPost) => {
	return await fetch(`${BASE_URL}/api/posts/${id}`, {
		method: 'DELETE',
	});
};

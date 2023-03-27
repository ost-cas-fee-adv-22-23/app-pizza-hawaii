type TGetPost = {
	id: string;
};

export const remove = async ({ id }: TGetPost) => {
	return await fetch(`/api/posts/${id}`, {
		method: 'DELETE',
	});
};

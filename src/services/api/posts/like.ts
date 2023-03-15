type TGetPost = {
	id: string;
};

export const like = async ({ id }: TGetPost) => {
	return await fetch(`api/posts/${id}/like`, {
		method: 'PUT',
	});
};

export const unlike = async ({ id }: TGetPost) => {
	return await fetch(`api/posts/${id}/like`, {
		method: 'DELETE',
	});
};

import { services } from '../../../services/users';
import { getToken } from 'next-auth/jwt';

export default async function getAll(req, res) {
	const { id } = req.query;
	const session = await getToken({ req });

	if (!session) {
		return res.status(401).json({
			status: false,
			error: `This is protected content. You can't access this content because you are not signed in.`,
		});
	}

	services.users
		.getUsers({
			id: id as string,
			session,
			limit: req.query.limit,
		})
		.then((data) => {
			res.status(200).json({ status: true, data });
		})
		.catch((error) => {
			res.status(500).json({ status: false, error });
		});
}

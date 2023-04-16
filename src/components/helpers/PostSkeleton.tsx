import { Card, Grid } from '@smartive-education/pizza-hawaii';

export const PostSkeleton = () => {
	return (
		<Card as="div" rounded={true} size="M">
			<div className="animate-pulse">
				<Grid variant="col" gap="L">
					<Grid variant="row" gap="S" centered={true}>
						<div className="absolute left-0 transform -translate-x-1/2">
							<div className="h-16 w-16 bg-gray-300 rounded-full" />
						</div>

						<Grid variant="col" gap="S">
							<div className="h-6 w-36 bg-gray-300 rounded-full max-w-[100%]" />
							<Grid variant="row" gap="S">
								<div className="h-5 w-24 bg-gray-300 rounded-full max-w-[100%]" />
								<div className="h-5 w-24 bg-gray-300 rounded-full max-w-[100%]" />
							</Grid>
						</Grid>
					</Grid>

					<Grid variant="col" gap="S">
						<div className="h-4 w-3/4 bg-gray-400 rounded-lg" />
						<div className="h-4 w-full bg-gray-400 rounded-lg" />
						<div className="h-4 w-1/2 bg-gray-400 rounded-lg" />
					</Grid>
				</Grid>
			</div>
		</Card>
	);
};

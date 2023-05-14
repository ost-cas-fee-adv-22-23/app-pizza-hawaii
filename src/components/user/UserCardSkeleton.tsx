import { Card, Grid } from '@smartive-education/pizza-hawaii';

export const UserCardSkeleton = () => {
	return (
		<Card as="div" rounded={true} size="S">
			<div className="animate-pulse">
				<Grid variant="col" gap="M" centered={true}>
					<div className="h-24 w-24 bg-gray-300 rounded-full" />

					<div className="flex flex-col gap-2">
						<div className="h-4 w-24 bg-gray-300 rounded-full max-w-[100px]" />
						<div className="h-5 w-24 bg-gray-300 rounded-full max-w-[100px]" />
					</div>

					<div className="h-10 w-full bg-gray-400 rounded-lg max-w-[160px]" />
				</Grid>
			</div>
		</Card>
	);
};

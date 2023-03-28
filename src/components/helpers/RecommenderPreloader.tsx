import { Grid, Card } from '@smartive-education/pizza-hawaii';

const PreLoader = () => {
	const index = [1, 2, 3, 4, 5, 6];

	return (
		<Grid variant="row" gap="S" marginBelow="M">
			<div className="mb-8">
				<div className="flex flex-row flex-wrap -m-2">
					{index.map((i) => (
						<div key={i} className="flex-initial w-4/12 p-3">
							<Card as="div" rounded={true} size="S">
								<div className="animate-pulse flex flex-col gap-2 p-1">
									<div className="flex-col inline-flex self-center">
										<div className="h-24 w-24 bg-gray-300 rounded-full" />
										<div className="mt-4 h-4 w-24 bg-gray-300 rounded-full max-w-[100px]" />
										<div className="mt-4 h-3 w-24 bg-gray-300 rounded-full max-w-[100px]" />
										<div className="mt-6 h-8 w-auto bg-gray-400 rounded-lg max-w-[160px]" />
									</div>
								</div>
							</Card>
						</div>
					))}
				</div>
			</div>
		</Grid>
	);
};

export default PreLoader;

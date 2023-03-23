import { Grid, Card } from '@smartive-education/pizza-hawaii';

const PreLoader = () => {
	const preloaderCounter = [1, 2, 3, 4, 5, 6];

	return (
		<Grid variant="row" gap="S" marginBelow="M">
			<div className="mb-8">
				<div className="flex flex-row flex-wrap -m-2">
					{preloaderCounter.map((preloader) => (
						<div key={1} className="flex-initial w-4/12 p-3">
							<Card as="div" rounded={true} size="S">
								<div className="animate-pulse flex flex-col gap-4 p-4">
									<div className="flex flex-row gap-4">
										<div className="h-12 w-12 bg-gray-400 rounded-full"></div>
										<div className="flex flex-col gap-2"></div>
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

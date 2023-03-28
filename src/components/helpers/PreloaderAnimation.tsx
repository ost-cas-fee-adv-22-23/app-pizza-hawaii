import { Card } from '@smartive-education/pizza-hawaii';

const PreloaderAnimationCard = () => {
	return (
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
	);
};

export default PreloaderAnimationCard;

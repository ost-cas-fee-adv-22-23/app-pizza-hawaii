import { useState, useEffect } from 'react';

const MIN_INTERVAL_MS = 5000; // 5 seconds
const MAX_INTERVAL_MS = 600000; // 10 minutes

/**
 * This hook will call the provided function every intervalMs milliseconds.
 * The intervalMs will increase by 10% each time, with a random jitter added to avoid multiple clients hitting the server at the same time (thundering herd problem)
 *
 * @param callbackFn The function to call every intervalMs milliseconds
 * @param minInterval The minimum interval in milliseconds
 * @param maxInterval The maximum interval in milliseconds
 */

const useIncreasingInterval = (
	callbackFn: () => void,
	minInterval: number = MIN_INTERVAL_MS,
	maxInterval: number = MAX_INTERVAL_MS
) => {
	const [intervalMs, setIntervalMs] = useState(minInterval);

	useEffect(() => {
		const intervalId = setInterval(() => {
			callbackFn();

			// Add a random jitter to avoid thundering herd problem
			const jitter = Math.random() * 0.1 * intervalMs;

			// Increase interval by 10% with a random jitter
			setIntervalMs((prevIntervalMs) => Math.floor(Math.min(prevIntervalMs * 1.1 + jitter, maxInterval)));
		}, intervalMs);

		return () => clearInterval(intervalId);
	}, [callbackFn, intervalMs, maxInterval]);
};

export default useIncreasingInterval;

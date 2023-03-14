import React from 'react';
import FourOhFourPage from '../pages/404';
import GlobalError from '../pages/global-error';

interface Props {
	className?: string;
	children: React.ReactNode;
}

interface State {
	error?: Error;
	hasError: boolean;
}

// yes this is a class component, because we need to use componentDidCatch
class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error: unknown) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error | unknown) {
		// may we also introduce an error logging service here - if there is time for that
		console.error({ error });
		const message = error?.toString() || 'unknown';
		return <FourOhFourPage error={Error} reason={message} />;
	}

	render() {
		// Check if the error is thrown
		if (this.state.hasError) {
			return <GlobalError error={this.state.error} />;
		} else {
			return this.props.children;
		}
	}
}

export default ErrorBoundary;

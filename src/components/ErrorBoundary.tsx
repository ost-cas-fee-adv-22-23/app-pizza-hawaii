import React from 'react';
import ErrorPage from 'next/error';

type Props = {
	className?: string;
	children: React.ReactNode;
};

type State = {
	error?: Error;
	hasError: boolean;
};

// yes this is a class component, because we need to use componentDidCatch
class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error: unknown) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error | unknown, errorInfo: React.ErrorInfo) {
		// may we also introduce an error logging service here - if there is time for that
		console.error(error, errorInfo);
	}

	render() {
		// Check if the error is thrown or pass children to applciation
		if (this.state.hasError) {
			return <ErrorPage statusCode={500} title={this?.state?.error?.message} />;
		} else {
			return this.props.children;
		}
	}
}

export default ErrorBoundary;

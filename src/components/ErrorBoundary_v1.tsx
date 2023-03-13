import { Component } from 'react';

// import ErrorPage from '@/components/page/errorPage/ErrorPage';
import GlobalError from '../pages/global-error';
import FourOhFourPage from '../pages/404';

interface Props {
	className?: string;
}

interface State {
	error?: Error;
	hasError: boolean;
}

// yes this is a class component, because we need to use componentDidCatch
// see https://reactjs.org/docs/error-boundaries.html
class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: unknown) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error | unknown) {
		const message = error?.toString() || 'unknown';
		return <FourOhFourPage error={Error} reason={message} />;
	}

	render() {
		if (this.state.hasError) {
			return <GlobalError error={this.state.error} />;
		}
	}
}
export default ErrorBoundary;

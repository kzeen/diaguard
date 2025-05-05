import { Component } from 'react';

export default class AppErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }
    render() {
        if (this.state.error)
            return (
                <div className="h-screen flex flex-col items-center justify-center gap-4">
                    <h1 className="text-3xl font-bold">Something went wrong.</h1>
                    <p className="max-w-md text-center text-sm text-gray-600">
                        An unexpected error occurred. Please reload the page or contact
                        support if the problem persists.
                    </p>
                </div>
            );
        return this.props.children;
    }
}

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2 font-['Outfit'] italic">Oops! Something went wrong.</h1>
                        <p className="text-gray-500 font-medium mb-8">We've encountered an unexpected error. Please try refreshing the page or navigating back home.</p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center btn-primary py-3 px-4 text-sm font-bold bg-gray-900 text-white hover:bg-black"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center justify-center btn-secondary py-3 px-4 text-sm font-bold border-2 border-gray-100 hover:bg-gray-50"
                            >
                                <Home className="w-4 h-4 mr-2" /> Go Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-gray-50 rounded-xl text-left border border-gray-100 overflow-auto max-h-40">
                                <p className="text-[10px] font-mono text-gray-600">{this.state.error?.toString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WealthTrace App Error Boundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 text-center">
          <div className="max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#0B1C30] mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-600 mb-6">
              An unexpected display issue occurred, but your financial data is preserved safely.
            </p>
            <div className="bg-slate-50 text-left p-3 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-32 mb-6">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 bg-[#0B1C30] hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <RefreshCw size={16} /> Recover Application State
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

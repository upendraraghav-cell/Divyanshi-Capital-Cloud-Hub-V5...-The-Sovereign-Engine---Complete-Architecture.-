import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./button";

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[System Critical] Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center sm:text-left">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Neural Matrix Fracture</h1>
                <p className="text-slate-400 text-sm">
                  An unexpected exception has occurred in the system core. 
                  SARI has logged the telemetry for the MD's review.
                </p>
              </div>

              {this.state.error && (
                <div className="w-full bg-black/40 rounded-xl p-4 text-left border border-white/5 overflow-auto max-h-32">
                  <code className="text-xs text-red-400 font-mono italic">
                    {this.state.error.toString()}
                  </code>
                </div>
              )}

              <Button 
                onClick={this.handleReset}
                variant="destructive"
                className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                REBOOT CORE ENGINE
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-coral-600" />
              </div>
            </div>
            <h2 className="text-h2 text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-body text-slate-500 mb-6">
              We encountered an unexpected error. Please try again or return to the dashboard.
            </p>
            {this.state.error && (
              <pre className="text-left text-tiny bg-slate-100 p-3 rounded-lg mb-6 overflow-auto max-h-32 text-slate-600">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={this.handleGoHome} leftIcon={<Home className="h-4 w-4" />}>
                Go Home
              </Button>
              <Button onClick={this.handleReset} leftIcon={<RefreshCw className="h-4 w-4" />}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Inline error display for smaller errors
interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ title = 'Error', message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-coral-50 border border-coral-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-coral-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-coral-900">{title}</h4>
          <p className="text-small text-coral-700 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-small text-coral-600 hover:text-coral-800 font-medium mt-2 inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

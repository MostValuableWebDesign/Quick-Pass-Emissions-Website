import { renderToString } from 'react-dom/server';
import App from './App';
import { ErrorBoundary } from './components/error-boundary';

export function render() {
  return renderToString(<ErrorBoundary><App /></ErrorBoundary>);
}

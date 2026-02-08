import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const Throw = () => {
  throw new Error('test error');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <span>תוכן רגיל</span>
      </ErrorBoundary>
    );
    expect(screen.getByText('תוכן רגיל')).toBeInTheDocument();
  });

  it('renders fallback when child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    );
    expect(screen.getByText(/משהו השתבש/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /רענן דף/ })).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});

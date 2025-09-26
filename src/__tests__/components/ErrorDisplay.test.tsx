import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay } from '../../components/ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders error message', () => {
    const errorMessage = 'Failed to load GIFs';
    render(<ErrorDisplay error={errorMessage} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    const mockOnRetry = jest.fn();
    render(<ErrorDisplay error="Test error" onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again to load gifs/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const mockOnRetry = jest.fn();
    render(<ErrorDisplay error="Test error" onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again to load gifs/i });
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('uses custom retry label when provided', () => {
    const mockOnRetry = jest.fn();
    render(
      <ErrorDisplay 
        error="Test error" 
        onRetry={mockOnRetry} 
        retryLabel="Reload" 
      />
    );
    
    const retryButton = screen.getByRole('button', { name: /reload to load gifs/i });
    expect(retryButton).toBeInTheDocument();
    expect(screen.getByText('Reload')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorDisplay error="Test error" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const mockOnRetry = jest.fn();
    render(<ErrorDisplay error="Test error" onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByRole('button');
    expect(retryButton).toHaveAttribute('aria-label', 'Try Again to load GIFs');
  });

  it('applies dark theme styling', () => {
    const { container } = render(<ErrorDisplay error="Test error" />);
    
    const errorDisplay = container.querySelector('.error-display');
    expect(errorDisplay).toBeInTheDocument();
    
    const heading = screen.getByText('Something went wrong');
    expect(heading).toHaveClass('text-gray-300');
    
    const errorText = screen.getByText('Test error');
    expect(errorText).toHaveClass('text-gray-400');
  });
});

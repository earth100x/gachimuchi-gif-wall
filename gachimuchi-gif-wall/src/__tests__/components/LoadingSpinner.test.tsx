import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner with proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading GIFs');
  });

  it('has screen reader only text', () => {
    render(<LoadingSpinner />);
    
    const srOnlyText = screen.getByText('Loading...');
    expect(srOnlyText).toHaveClass('sr-only');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinnerElement = container.querySelector('.animate-spin');
    expect(spinnerElement).toHaveClass('rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-500');
  });
});

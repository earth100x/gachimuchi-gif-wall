import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GIFItem } from '../../components/GIFItem';
import { GIF } from '../../types';

const mockGIF: GIF = {
  id: 'test-gif-1',
  title: 'Test GIF',
  url: 'https://example.com/test.gif',
  preview: 'https://example.com/test-preview.gif',
  dimensions: {
    width: 300,
    height: 200
  },
  created: '2025-01-12T00:00:00Z'
};

describe('GIFItem', () => {
  it('renders GIF with correct attributes', () => {
    render(<GIFItem gif={mockGIF} />);
    
    const img = screen.getByAltText('Test GIF');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src');
    expect(img).toHaveAttribute('width', '300');
    expect(img).toHaveAttribute('height', '200');
  });

  it('applies correct aspect ratio styling', () => {
    render(<GIFItem gif={mockGIF} />);
    
    const img = screen.getByAltText('Test GIF');
    expect(img).toHaveStyle('aspect-ratio: 300 / 200');
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<GIFItem gif={mockGIF} onClick={mockOnClick} />);
    
    const gifItem = screen.getByRole('button');
    fireEvent.click(gifItem);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockGIF);
  });

  it('calls onClick when Enter key is pressed', () => {
    const mockOnClick = jest.fn();
    render(<GIFItem gif={mockGIF} onClick={mockOnClick} />);
    
    const gifItem = screen.getByRole('button');
    fireEvent.keyDown(gifItem, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalledWith(mockGIF);
  });

  it('calls onClick when Space key is pressed', () => {
    const mockOnClick = jest.fn();
    render(<GIFItem gif={mockGIF} onClick={mockOnClick} />);
    
    const gifItem = screen.getByRole('button');
    fireEvent.keyDown(gifItem, { key: ' ' });
    
    expect(mockOnClick).toHaveBeenCalledWith(mockGIF);
  });

  it('has proper accessibility attributes', () => {
    render(<GIFItem gif={mockGIF} />);
    
    const gifItem = screen.getByRole('button');
    expect(gifItem).toHaveAttribute('aria-label', 'View GIF: Test GIF');
    expect(gifItem).toHaveAttribute('tabIndex', '0');
  });

  it('applies dark theme styling', () => {
    render(<GIFItem gif={mockGIF} />);
    
    const gifItem = screen.getByRole('button');
    expect(gifItem).toHaveClass('bg-gray-800');
  });
});

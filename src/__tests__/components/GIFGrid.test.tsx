import React from 'react';
import { render, screen } from '@testing-library/react';
import { GIFGrid } from '../../components/GIFGrid';
import { GIF } from '../../types';

// Mock the useInfiniteScroll hook
jest.mock('../../hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: jest.fn(() => ({
    targetRef: { current: null },
    isIntersecting: false,
    loadMore: jest.fn(),
  })),
}));

const mockGIFs: GIF[] = [
  {
    id: 'test-gif-1',
    title: 'Test GIF 1',
    url: 'https://example.com/test1.gif',
    preview: 'https://example.com/test1-preview.gif',
    dimensions: { width: 300, height: 200 },
    created: '2025-01-12T00:00:00Z'
  },
  {
    id: 'test-gif-2',
    title: 'Test GIF 2',
    url: 'https://example.com/test2.gif',
    preview: 'https://example.com/test2-preview.gif',
    dimensions: { width: 400, height: 300 },
    created: '2025-01-12T00:00:00Z'
  }
];

describe('GIFGrid', () => {
  it('renders GIFs in grid layout', () => {
    render(<GIFGrid gifs={mockGIFs} />);
    
    expect(screen.getByAltText('Test GIF 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test GIF 2')).toBeInTheDocument();
  });

  it('applies responsive grid classes', () => {
    const { container } = render(<GIFGrid gifs={mockGIFs} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-4');
  });

  it('shows loading spinner when loading', () => {
    render(<GIFGrid gifs={mockGIFs} loading={true} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows no GIFs message when empty', () => {
    render(<GIFGrid gifs={[]} />);
    
    expect(screen.getByText('No GIFs found')).toBeInTheDocument();
  });

  it('calls onGifClick when GIF is clicked', () => {
    const mockOnGifClick = jest.fn();
    render(<GIFGrid gifs={mockGIFs} onGifClick={mockOnGifClick} />);
    
    const firstGif = screen.getByAltText('Test GIF 1');
    firstGif.closest('[role="button"]')?.click();
    
    expect(mockOnGifClick).toHaveBeenCalledWith(mockGIFs[0]);
  });

  it('renders without loading spinner when not loading', () => {
    render(<GIFGrid gifs={mockGIFs} loading={false} />);
    
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows infinite scroll trigger when hasMore is true and not loading', () => {
    render(<GIFGrid gifs={mockGIFs} hasMore={true} loading={false} />);
    
    expect(screen.getByTestId('infinite-scroll-trigger')).toBeInTheDocument();
  });

  it('does not show infinite scroll trigger when hasMore is false', () => {
    render(<GIFGrid gifs={mockGIFs} hasMore={false} loading={false} />);
    
    expect(screen.queryByTestId('infinite-scroll-trigger')).not.toBeInTheDocument();
  });

  it('does not show infinite scroll trigger when loading', () => {
    render(<GIFGrid gifs={mockGIFs} hasMore={true} loading={true} />);
    
    expect(screen.queryByTestId('infinite-scroll-trigger')).not.toBeInTheDocument();
  });

  it('calls useInfiniteScroll with correct parameters', () => {
    const mockOnLoadMore = jest.fn();
    const { useInfiniteScroll } = jest.requireActual('../../hooks/useInfiniteScroll');
    
    render(
      <GIFGrid 
        gifs={mockGIFs} 
        hasMore={true} 
        loading={false} 
        onLoadMore={mockOnLoadMore} 
      />
    );
    
    expect(useInfiniteScroll).toHaveBeenCalledWith(
      mockOnLoadMore,
      {
        enabled: true,
        rootMargin: '0px 0px 200px 0px',
      }
    );
  });

  it('disables infinite scroll when hasMore is false', () => {
    const { useInfiniteScroll } = jest.requireActual('../../hooks/useInfiniteScroll');
    
    render(
      <GIFGrid 
        gifs={mockGIFs} 
        hasMore={false} 
        loading={false} 
      />
    );
    
    expect(useInfiniteScroll).toHaveBeenCalledWith(
      expect.any(Function),
      {
        enabled: false,
        rootMargin: '0px 0px 200px 0px',
      }
    );
  });

  it('disables infinite scroll when loading', () => {
    const { useInfiniteScroll } = jest.requireActual('../../hooks/useInfiniteScroll');
    
    render(
      <GIFGrid 
        gifs={mockGIFs} 
        hasMore={true} 
        loading={true} 
      />
    );
    
    expect(useInfiniteScroll).toHaveBeenCalledWith(
      expect.any(Function),
      {
        enabled: false,
        rootMargin: '0px 0px 200px 0px',
      }
    );
  });
});

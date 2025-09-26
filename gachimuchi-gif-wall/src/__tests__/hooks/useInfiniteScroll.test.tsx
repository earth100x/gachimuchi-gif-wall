import { renderHook, act, render } from '@testing-library/react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import React from 'react';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

mockIntersectionObserver.mockReturnValue({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
});

// @ts-ignore
global.IntersectionObserver = mockIntersectionObserver;

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create intersection observer with default options', () => {
    const callback = jest.fn();
    
    const TestComponent = () => {
      const { targetRef } = useInfiniteScroll(callback);
      return <div ref={targetRef} data-testid="target" />;
    };
    
    render(<TestComponent />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px',
      }
    );
  });

  it('should create intersection observer with custom options', () => {
    const callback = jest.fn();
    const options = {
      threshold: 0.5,
      rootMargin: '0px 0px 200px 0px',
      delayInMs: 200,
    };

    const TestComponent = () => {
      const { targetRef } = useInfiniteScroll(callback, options);
      return <div ref={targetRef} data-testid="target" />;
    };
    
    render(<TestComponent />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.5,
        rootMargin: '0px 0px 200px 0px',
      }
    );
  });

  it('should call callback when element intersects', () => {
    const callback = jest.fn();
    
    const TestComponent = () => {
      const { targetRef } = useInfiniteScroll(callback);
      return <div ref={targetRef} data-testid="target" />;
    };
    
    render(<TestComponent />);

    // Get the observer callback function
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Fast-forward timers to trigger the delayed callback
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when element is not intersecting', () => {
    const callback = jest.fn();
    
    const TestComponent = () => {
      const { targetRef } = useInfiniteScroll(callback);
      return <div ref={targetRef} data-testid="target" />;
    };
    
    render(<TestComponent />);

    // Get the observer callback function
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate non-intersection
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should debounce callback calls', () => {
    const callback = jest.fn();
    
    const TestComponent = () => {
      const { targetRef } = useInfiniteScroll(callback, { delayInMs: 200 });
      return <div ref={targetRef} data-testid="target" />;
    };
    
    render(<TestComponent />);

    // Get the observer callback function
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // Simulate multiple rapid intersections
    act(() => {
      observerCallback([{ isIntersecting: true }]);
      observerCallback([{ isIntersecting: true }]);
      observerCallback([{ isIntersecting: true }]);
    });

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should only be called once due to debouncing
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not observe when disabled', () => {
    const callback = jest.fn();

    renderHook(() => useInfiniteScroll(callback, { enabled: false }));

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('should provide targetRef for DOM element', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback));

    expect(result.current.targetRef).toBeDefined();
    expect(result.current.targetRef.current).toBeNull();
  });

  it('should cleanup observer on unmount', () => {
    const callback = jest.fn();

    const TestComponent = () => {
      const { targetRef } = useInfiniteScroll(callback);
      return <div ref={targetRef} data-testid="target" />;
    };
    
    const { unmount } = render(<TestComponent />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should clear timeout on unmount', () => {
    const callback = jest.fn();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    const TestComponent = () => {
      const { targetRef } = useInfiniteScroll(callback);
      return <div ref={targetRef} data-testid="target" />;
    };
    
    const { unmount } = render(<TestComponent />);

    // Trigger intersection to set up timeout
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

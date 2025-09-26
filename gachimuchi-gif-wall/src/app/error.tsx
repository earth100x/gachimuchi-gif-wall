'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <h2 className="text-xl font-semibold mb-4 text-red-400">
        Something went wrong!
      </h2>
      <p className="text-gray-300 mb-4 text-center">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

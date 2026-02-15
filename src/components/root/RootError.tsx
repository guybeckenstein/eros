import { ErrorComponentProps, Link, useRouter } from '@tanstack/react-router';

export function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter text-red-600 sm:text-4xl">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground max-w-150">
          {error.message ||
            'An unexpected error occurred. Please try again or contact support if the problem persists.'}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            // Invalidate the router and try to re-render
            router.invalidate();
            reset();
          }}
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white transition-colors"
        >
          Try Again
        </button>

        <Link
          to="/"
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-8 max-w-full overflow-auto rounded bg-slate-100 p-4 text-xs text-red-500">
          {error.stack}
        </pre>
      )}
    </div>
  );
}

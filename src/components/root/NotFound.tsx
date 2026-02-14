import { Link } from '@tanstack/react-router';

export function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="text-primary underline hover:no-underline">
        Go back home
      </Link>
    </div>
  );
}

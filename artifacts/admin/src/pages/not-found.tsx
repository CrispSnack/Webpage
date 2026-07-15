import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex max-w-md flex-col items-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mb-6 text-sm text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

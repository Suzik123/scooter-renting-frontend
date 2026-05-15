export default function RouteFallback() {
  return (
    <div
      className="min-h-[50vh] flex items-center justify-center bg-[var(--color-bg)]"
      role="status"
      aria-live="polite"
    >
      <div
        aria-label="Loading page"
        className="h-6 w-6 rounded-full border-2 border-[var(--color-border)] border-t-primary animate-spin"
      />
    </div>
  );
}

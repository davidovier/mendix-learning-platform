export function PendingBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <span className="font-medium">Capgemini access pending</span>
          {" — "}your request is awaiting admin approval. Free tier access applies in the meantime.
        </p>
      </div>
    </div>
  );
}

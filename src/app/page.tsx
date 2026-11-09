/** Renders the initial server-side homepage while later stories add features. */
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-2xl">
        <p className="text-sm font-semibold text-slate-600">
          Malvern Panalytical
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Product listing technical exercise
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          The application is running. This homepage provides the starting point
          for the product listing application.
        </p>
      </div>
    </main>
  );
}

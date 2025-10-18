// Error UI

export default function ErrorPage() {
  return (
    <div className="font-sans grid grid-rows-[1fr] items-center justify-items-center min-h-screen p-8 sm:p-20">
      <main className="flex flex-col gap-[32px] items-center sm:items-start">
        <h1 className="text-4xl font-bold">Oops! Something went wrong.</h1>
        <p className="text-lg text-center sm:text-left">
          An unexpected error has occurred. Please try refreshing the page or come back later.
        </p>
      </main>
    </div>
  );
}
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 animate-spin rounded-full border-primary border-t-4 border-b-4" />
        <div className="animation-delay-150 absolute top-2 left-2 h-20 w-20 animate-spin rounded-full border-secondary border-t-4 border-b-4" />
      </div>

      <h2 className="mt-8 animate-pulse font-medium text-xl">Cargando...</h2>

      <div className="mt-4 max-w-md text-center text-muted-foreground">
        <p>Estamos procesando tu solicitud. Esto puede tomar unos momentos.</p>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full animate-progress-bar bg-primary" />
        </div>
      </div>
    </div>
  );
}

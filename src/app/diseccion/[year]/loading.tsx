import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-primary-dark to-primary h-16" />
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-3 text-text-secondary text-sm">Cargando diseccion...</p>
        </div>
      </div>
    </div>
  );
}

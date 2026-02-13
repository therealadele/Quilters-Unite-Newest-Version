import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  }>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Suspense>
);

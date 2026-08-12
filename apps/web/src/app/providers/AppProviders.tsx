import { createContext, useContext, useMemo, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { initI18n } from "@onehealth/i18n";
import { useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Loading } from "@onehealth/ui-kit";

const i18n = initI18n("en");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});

const AppCtx = createContext({ ready: false });

export function AppProviders({ children }: { children: ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const bootstrapping = useAuthStore((s) => s.bootstrapping);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const value = useMemo(() => ({ ready: !bootstrapping }), [bootstrapping]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AppCtx.Provider value={value}>
          {bootstrapping ? <Loading fullScreen label="Starting OneHealth…" /> : children}
        </AppCtx.Provider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export function useAppReady() {
  return useContext(AppCtx);
}

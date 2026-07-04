import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = useMemoToast(push);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-fade-in card flex items-start gap-3 border-l-4 p-3.5 pr-2 shadow-soft"
            style={{
              borderLeftColor:
                t.type === "success" ? "#1F9D55" : t.type === "error" ? "#D64545" : "#4357e0",
            }}
          >
            {t.type === "success" && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />}
            {t.type === "error" && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />}
            {t.type === "info" && <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />}
            <p className="flex-1 text-sm text-ink-700">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-600"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useMemoToast(push) {
  return {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

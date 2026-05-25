import { useState } from "react";

// useState com persistência no localStorage.
// Sobrevive a page reloads — os dados dos alunos, dúvidas e avisos
// ficam salvos entre sessões sem precisar de backend.
export function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = (updater) => {
    setVal((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // localStorage indisponível (modo privado restrito)
      }
      return next;
    });
  };

  return [val, set];
}

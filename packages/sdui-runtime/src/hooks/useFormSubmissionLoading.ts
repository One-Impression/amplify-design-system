import { useState, useCallback } from "react";

interface FormSubmissionState {
  loading: boolean;
  submit: (fn: () => Promise<void>) => Promise<void>;
}

/**
 * Manages loading state during async form submissions.
 * Prevents double-submit by guarding with the loading flag.
 * Ported 1:1 from legacy.
 */
export function useFormSubmissionLoading(): FormSubmissionState {
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async (fn: () => Promise<void>) => {
    if (loading) return;
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return { loading, submit };
}

"use client";

import { useEffect, useActionState, useRef, useCallback } from "react";
import { toast } from "sonner";

interface FormState<T> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

interface UseFormStateProps<T> {
  action: (
    state: FormState<T> | undefined,
    formData: FormData,
  ) => Promise<FormState<T>>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useFormState<T>({
  action,
  onSuccess,
  onError,
}: UseFormStateProps<T>) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message as string);
      if (state.data) {
        onSuccess?.(state.data);
      }
      formRef.current?.reset();
    } else if (state?.message) {
      toast.error(state.message as string);
      if (state.message) {
        onError?.(state.message);
      }
    }
  }, [state, onSuccess, onError]);

  return {
    state,
    formAction,
    isPending,
    formRef,
  };
}

import { toast as sonnerToast } from 'sonner'
import { Toaster } from 'sonner'

type ToastOptions = Parameters<typeof sonnerToast>[1]

/**
 * Type-safe facade over sonner for the application's notification needs.
 *
 * Usage notes:
 * - `toast.loading(...)` returns an id that can be used to resolve the
 *   loading toast later: `toast.success('Done', { id })`.
 * - `toast.promise(...)` covers the loading → success/error lifecycle.
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => sonnerToast.success(message, options),
  error: (message: string, options?: ToastOptions) => sonnerToast.error(message, options),
  warning: (message: string, options?: ToastOptions) => sonnerToast.warning(message, options),
  info: (message: string, options?: ToastOptions) => sonnerToast.info(message, options),
  loading: (message: string, options?: ToastOptions) => sonnerToast.loading(message, options),
  dismiss: (id?: string | number) =>
    typeof id === 'undefined' ? sonnerToast.dismiss() : sonnerToast.dismiss(id),
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) =>
    sonnerToast.promise<T>(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    }),
}

export type { ToastOptions }
export { Toaster }

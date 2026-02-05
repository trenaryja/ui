import { useEffect } from 'react'

/**
 * Shows the browser's native "unsaved changes" unload prompt when `isDirty` is true.
 *
 * - Triggers on refresh/close/navigate away (full page unload), not SPA routing.
 * - Most browsers ignore custom text; this uses the generic prompt behavior.
 */
export const useUnsavedChangesPrompt = (isDirty: boolean) => {
	useEffect(() => {
		if (typeof window === 'undefined') return
		if (!isDirty) return

		const onBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault()
		}

		window.addEventListener('beforeunload', onBeforeUnload)
		return () => window.removeEventListener('beforeunload', onBeforeUnload)
	}, [isDirty])
}

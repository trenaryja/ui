import { useEffect, useRef } from 'react'

/**
 * Shows the browser’s native “unsaved changes” unload prompt when `isDirty` is true.
 *
 * - Triggers on refresh/close/navigate away (full page unload), not SPA routing.
 * - Most browsers ignore custom text; this uses the generic prompt behavior.
 */
export function useUnsavedChangesPrompt(isDirty: boolean): void {
	const isDirtyRef = useRef(isDirty)
	useEffect(() => {
		isDirtyRef.current = isDirty
	}, [isDirty])

	useEffect(() => {
		if (typeof window === 'undefined') return

		const onBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!isDirtyRef.current) return
			event.preventDefault()
		}

		window.addEventListener('beforeunload', onBeforeUnload)
		return () => window.removeEventListener('beforeunload', onBeforeUnload)
	}, [])
}

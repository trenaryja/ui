import type { ToasterProps as SonnerProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'
import type { OverrideProperties } from 'type-fest'

export { toast } from 'sonner'

export const toastPositions = [
	'top-left',
	'top-center',
	'top-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
] as const satisfies SonnerProps['position'][]
export type ToastPosition = (typeof toastPositions)[number]

export type ToasterProps = OverrideProperties<SonnerProps, { position?: ToastPosition }>

const defaultToastOptions = {
	unstyled: true,
	classNames: {
		title: 'font-bold',
		content: 'w-full',
		success: 'alert-success',
		error: 'alert-error',
		info: 'alert-info',
		warning: 'alert-warning',
		actionButton: 'btn btn-sm btn-ghost',
		cancelButton: 'btn btn-sm btn-ghost',
		closeButton: 'btn btn-ghost absolute opacity-0 group-hover:opacity-100 -top-0 -right-0 btn-xs btn-circle',
		loader: 'relative!',
	},
	className: 'alert group w-full',
} as const satisfies SonnerProps['toastOptions']

export const Toaster = ({ toastOptions, ...props }: ToasterProps) => (
	<Sonner toastOptions={{ ...defaultToastOptions, ...toastOptions }} {...props} />
)

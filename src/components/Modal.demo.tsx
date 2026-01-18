import type { ModalDismissOption } from '@/components/Modal'
import { Modal, MODAL_DISMISS_OPTIONS } from '@/components/Modal'
import { cn } from '@/utils'
import type { DemoMeta } from '@demo/utils'
import { useMemo, useState } from 'react'

export const meta: DemoMeta = { title: 'Modal', category: 'components' }

export const Demo = () => {
	const [isControlled, setIsControlled] = useState(true)
	const [open, setOpen] = useState(false)
	const [backdropBlur, setBackdropBlur] = useState(false)
	const [backdropTransparent, setBackdropTransparent] = useState(false)

	const [dismiss, setDismiss] = useState<ModalDismissOption[]>([...MODAL_DISMISS_OPTIONS])

	const has = (opt: ModalDismissOption) => dismiss.includes(opt)
	const toggle = (opt: ModalDismissOption) =>
		setDismiss((xs) => (xs.includes(opt) ? xs.filter((x) => x !== opt) : [...xs, opt]))

	const isDismissable = dismiss.length > 0

	const modalProps = useMemo(
		() => (isControlled ? { open, onOpenChange: setOpen } : { defaultOpen: false, onOpenChange: () => undefined }),
		[isControlled, open],
	)

	return (
		<div className='demo'>
			<fieldset className='grid gap-10 w-full place-items-center'>
				<label className='flex gap-2 justify-center'>
					<span>Controlled</span>
					<input
						checked={isControlled}
						className='toggle'
						type='checkbox'
						onChange={(e) => {
							const next = e.target.checked
							setIsControlled(next)
							if (!next) setOpen(false)
						}}
					/>
				</label>

				<div className='grid sm:flex gap-4'>
					{MODAL_DISMISS_OPTIONS.map((opt) => {
						const isOn = has(opt)
						return (
							<button
								className={cn(`btn grow`, { 'btn-primary': isOn })}
								key={opt}
								type='button'
								onClick={() => toggle(opt)}
							>
								{opt === 'closeButton'
									? 'Show close (X) button'
									: opt === 'outsideClick'
										? 'Close on outside click'
										: 'Close on Escape keypress'}
							</button>
						)
					})}
				</div>
			</fieldset>

			<Modal
				{...modalProps}
				className=''
				backdropBlur={backdropBlur}
				backdropTransparent={backdropTransparent}
				dismissOptions={dismiss}
				trigger={
					<button className='btn' type='button'>
						Open modal
					</button>
				}
			>
				{({ close }) => (
					<div className='grid gap-4'>
						<h2 className='text-lg font-semibold'>Modal</h2>
						<label className='flex gap-2 items-center'>
							<input
								checked={backdropBlur}
								className='checkbox'
								type='checkbox'
								onChange={(e) => setBackdropBlur(e.target.checked)}
							/>
							<span>Blurred backdrop</span>
						</label>
						<label className='flex gap-2 items-center'>
							<input
								checked={backdropTransparent}
								className='checkbox'
								type='checkbox'
								onChange={(e) => setBackdropTransparent(e.target.checked)}
							/>
							<span>Transparent backdrop</span>
						</label>

						{!isDismissable ? (
							<>
								<p className='text-sm opacity-80'>
									{'Dismiss is disabled. '}
									{isControlled
										? 'The only way out is an explicit coded action like clicking this button.'
										: 'In uncontrolled mode you can be trapped; this button will refresh the page.'}
								</p>
								<button
									className='btn btn-warning'
									type='button'
									onClick={() => {
										if (isControlled) close()
										else window.location.reload()
									}}
								>
									{isControlled ? 'Acknowledge' : 'Refresh page'}
								</button>
							</>
						) : (
							<div className='grid gap-2 text-sm'>
								{has('outsideClick') && <div>• Click outside the box to close.</div>}
								{has('escapeKey') && <div>• Press Escape to close.</div>}
								{has('closeButton') && <div>• Use the close button in the corner.</div>}
							</div>
						)}
					</div>
				)}
			</Modal>
		</div>
	)
}

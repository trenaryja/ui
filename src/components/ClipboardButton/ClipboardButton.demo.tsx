import { ClipboardButton, Fieldset, Range, toast, Toaster } from '@/components'
import { useCycle } from '@/hooks'
import type { DemoMeta } from '@demo'
import { useState } from 'react'
import { LuCalendar, LuCheck, LuCopy, LuX } from 'react-icons/lu'

export const meta: DemoMeta = { title: 'ClipboardButton', category: 'components', tags: ['input'] }

const copyText = 'Hello, world!'

const today = new Date()
const dateFormats = ['iso', 'us', 'long'] as const
const dateValues = {
	iso: today.toISOString().slice(0, 10),
	us: today.toLocaleDateString('en-US'),
	long: today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}

const forceErrorCopy = (): string => {
	;(navigator.clipboard as any).writeText = () => Promise.reject(new Error('Clipboard access denied'))
	setTimeout(() => delete (navigator.clipboard as any).writeText, 0)
	return copyText
}

export function Demo() {
	const [timeoutMs, setTimeoutMs] = useState(2000)
	const dateCycle = useCycle(dateFormats, { idleResetMs: 2050 })

	return (
		<div className='demo'>
			<Toaster />

			<Fieldset legend='Default' className='fieldset-flex-examples'>
				<ClipboardButton copy={copyText} className='btn-square' />
			</Fieldset>

			<Fieldset legend='Custom children' className='fieldset-flex-examples'>
				<ClipboardButton copy={copyText}>
					<LuCopy />
					<span>Copy</span>
				</ClipboardButton>
			</Fieldset>

			<Fieldset legend='Custom feedback' className='fieldset-flex-examples'>
				<ClipboardButton
					copy={copyText}
					classNames={{ copied: 'btn-success' }}
					copiedChildren={
						<>
							<LuCheck />
							<span>Copied!</span>
						</>
					}
				/>
				<ClipboardButton copy={copyText} onCopy={(value) => toast.success(`Copied: "${value}"`)} />
			</Fieldset>

			<Fieldset legend='Error state' className='fieldset-flex-examples'>
				<ClipboardButton copy={forceErrorCopy} classNames={{ error: 'btn-error' }} />
				<ClipboardButton
					copy={forceErrorCopy}
					classNames={{ error: 'btn-error' }}
					errorChildren={
						<>
							<LuX />
							<span>Failed!</span>
						</>
					}
					onError={(e) => toast.error(e.message)}
				/>
			</Fieldset>

			<Fieldset legend='Timeout bar' className='flex flex-col items-center gap-4 [&_legend]:text-center'>
				<div className='flex items-center gap-3'>
					<Range
						min={500}
						max={5000}
						step={500}
						value={timeoutMs}
						onChange={(e) => setTimeoutMs(e.target.valueAsNumber)}
					/>
					<span>{timeoutMs}ms</span>
				</div>
				<ClipboardButton
					copy={copyText}
					timeout={timeoutMs}
					showTimeoutBar
					className='btn-square'
					onTimeout={() => toast.info('Timeout')}
				/>
			</Fieldset>

			<Fieldset legend='Dynamic copy (press multiple times)' className='fieldset-flex-examples'>
				<ClipboardButton
					copy={() => dateValues[dateCycle.value]}
					onCopy={() => dateCycle.increment()}
					classNames={{ default: 'btn-square' }}
					copiedChildren={
						<>
							<span>{dateValues[dateCycle.prev]}</span>
							<span className='text-base-content/50'>Copied!</span>
						</>
					}
				>
					<LuCalendar />
				</ClipboardButton>
			</Fieldset>
		</div>
	)
}

import { ConfirmButton, Fieldset, Range, toast, Toaster } from '@/components'
import { wait } from '@/utils'
import type { DemoMeta } from '@demo'
import { useState } from 'react'
import { LuTrash } from 'react-icons/lu'

export const meta: DemoMeta = { title: 'ConfirmButton', category: 'components', tags: ['input'] }

export function Demo() {
	const [timeoutMs, setTimeoutMs] = useState(3000)

	return (
		<div className='demo'>
			<Toaster />

			<Fieldset legend='Basic' className='fieldset-flex-examples'>
				<ConfirmButton
					classNames={{ confirm: 'btn-error', default: 'btn-square' }}
					onConfirm={() => toast.success('Deleted!')}
				>
					<LuTrash />
				</ConfirmButton>
			</Fieldset>

			<Fieldset legend='Confirm children' className='fieldset-flex-examples'>
				<ConfirmButton
					classNames={{ confirm: 'btn-error', default: 'btn-square' }}
					confirmChildren={
						<>
							<LuTrash />
							<span>Are you sure?</span>
						</>
					}
					onConfirm={() => toast.success('Deleted!')}
				>
					<LuTrash />
				</ConfirmButton>
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
				<ConfirmButton
					classNames={{ confirm: 'btn-error', default: 'btn-square' }}
					confirmChildren={
						<>
							<LuTrash />
							<span>Are you sure?</span>
						</>
					}
					onConfirm={() => toast.success('Deleted!')}
					onTimeout={() => toast.info('Timed out')}
					timeout={timeoutMs}
					showTimeoutBar
				>
					<LuTrash />
				</ConfirmButton>
			</Fieldset>

			<Fieldset legend='Cancel options' className='fieldset-flex-examples'>
				<ConfirmButton
					classNames={{ confirm: 'btn-error', default: 'btn-square' }}
					confirmChildren={
						<>
							<LuTrash />
							<span>Click outside</span>
						</>
					}
					onCancel={() => toast.info('Cancelled')}
					onConfirm={() => toast.success('Deleted!')}
					cancelOptions={['outsideClick']}
				>
					<LuTrash />
				</ConfirmButton>
				<ConfirmButton
					classNames={{ confirm: 'btn-error', default: 'btn-square' }}
					confirmChildren={
						<>
							<LuTrash />
							<span>Tab away</span>
						</>
					}
					onCancel={() => toast.info('Cancelled')}
					onConfirm={() => toast.success('Deleted!')}
					cancelOptions={['blur']}
				>
					<LuTrash />
				</ConfirmButton>
				<ConfirmButton
					classNames={{ confirm: 'btn-error', default: 'btn-square' }}
					confirmChildren={
						<>
							<LuTrash />
							<span>Press Escape</span>
						</>
					}
					onCancel={() => toast.info('Cancelled')}
					onConfirm={() => toast.success('Deleted!')}
					cancelOptions={['escapeKey']}
				>
					<LuTrash />
				</ConfirmButton>
			</Fieldset>

			<Fieldset legend='Async confirm' className='fieldset-flex-examples'>
				<ConfirmButton
					classNames={{ confirm: 'btn-error', default: 'btn-square', pending: 'btn-warning' }}
					confirmChildren={
						<>
							<LuTrash />
							<span>Are you sure?</span>
						</>
					}
					pendingChildren={
						<>
							<span className='loading loading-spinner loading-xs' />
							<span>Deleting…</span>
						</>
					}
					onConfirm={async () => {
						await wait(1500)
						toast.success('Deleted!')
					}}
				>
					<LuTrash />
				</ConfirmButton>
			</Fieldset>
		</div>
	)
}

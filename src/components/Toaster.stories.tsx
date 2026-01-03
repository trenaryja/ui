import type { ToastPosition } from '@/components'
import {
	Button,
	ColorButton,
	Field,
	Fieldset,
	Input,
	Radio,
	Range,
	Select,
	Textarea,
	toast,
	Toaster,
	toastPositions,
	Toggle,
} from '@/components'
import { toastPositionIcons } from '@/stories/utils'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useReducer } from 'react'
import * as Lu from 'react-icons/lu'
import * as R from 'remeda'
import type { ExternalToast } from 'sonner'
import type { OverrideProperties } from 'type-fest'

const meta = { title: 'components/Toaster' } satisfies Meta
export default meta

const initialState = {
	expand: false,
	position: 'bottom-right' as const satisfies ToastPosition,
	visibleToasts: 3,
	closeButton: false,

	title: 'Hello World',
	description: 'This is a description',
	hasDescription: false,
	showCloseButton: false,
	duration: 4000,
	useInfiniteDuration: false,
	overridePosition: false,
	toastPosition: 'top-center' as const satisfies ToastPosition,
	dismissible: true,
	icon: undefined as keyof typeof Lu | undefined,
	hasAction: false,
	actionLabel: 'Action',
	hasCancel: false,
	cancelLabel: 'Cancel',
}

type ToastState = OverrideProperties<typeof initialState, { position?: ToastPosition; toastPosition?: ToastPosition }>

type ToastAction = Partial<ToastState>

const GlobalSettings = ({ state, dispatch }: { state: ToastState; dispatch: React.Dispatch<ToastAction> }) => (
	<Fieldset legend='Global Settings'>
		<Field label='Expand by default'>
			<Toggle checked={state.expand} onChange={(e) => dispatch({ expand: e.target.checked })} />
		</Field>
		<Field label='Show close button'>
			<Toggle checked={state.closeButton} onChange={(e) => dispatch({ closeButton: e.target.checked })} />
		</Field>
		<Field label={`Visible toasts: ${state.visibleToasts}`}>
			<Range
				min={1}
				max={20}
				value={state.visibleToasts}
				onChange={(e) => dispatch({ visibleToasts: e.target.valueAsNumber })}
			/>
		</Field>
		<Field label={`Position: ${state.position}`} classNames={{ control: 'grid grid-cols-3 place-items-center gap-4' }}>
			{toastPositions.map((p) => (
				<Radio
					key={p}
					className='reset btn btn-circle'
					type='radio'
					name='position'
					aria-label={toastPositionIcons[p]}
					value={p}
					checked={state.position === p}
					onChange={(e) => dispatch({ position: e.target.value as ToastPosition })}
				/>
			))}
		</Field>
	</Fieldset>
)

const ToastSettings = ({ state, dispatch }: { state: ToastState; dispatch: React.Dispatch<ToastAction> }) => (
	<Fieldset legend='Per-toast settings'>
		<Field label='Title'>
			<Input value={state.title} onChange={(e) => dispatch({ title: e.target.value })} />
		</Field>
		<Field label='Add Description'>
			<Toggle checked={state.hasDescription} onChange={(e) => dispatch({ hasDescription: e.target.checked })} />
		</Field>
		{state.hasDescription && (
			<Field label='Description'>
				<Textarea value={state.description} onChange={(e) => dispatch({ description: e.target.value })} />
			</Field>
		)}
		<Field label='Close Button'>
			<Toggle
				checked={state.showCloseButton ?? false}
				onChange={(e) => dispatch({ showCloseButton: e.target.checked })}
			/>
		</Field>
		<Field label='∞ Duration'>
			<Toggle
				checked={state.useInfiniteDuration}
				onChange={(e) => dispatch({ useInfiniteDuration: e.target.checked })}
			/>
		</Field>
		{!state.useInfiniteDuration && (
			<Field label={`Duration: ${state.duration}ms`}>
				<Range
					max={10000}
					min={1000}
					step={500}
					value={state.duration}
					onChange={(e) => dispatch({ duration: e.target.valueAsNumber })}
				/>
			</Field>
		)}
		<Field label='Override position'>
			<Toggle checked={state.overridePosition} onChange={(e) => dispatch({ overridePosition: e.target.checked })} />
		</Field>
		{state.overridePosition && (
			<Field
				label={`Position: ${state.position}`}
				classNames={{ control: 'grid grid-cols-3 place-items-center gap-4' }}
			>
				{toastPositions.map((p) => (
					<Radio
						key={p}
						className='reset btn btn-circle'
						type='radio'
						name='toast-position'
						aria-label={toastPositionIcons[p]}
						value={p}
						checked={state.toastPosition === p}
						onChange={(e) => dispatch({ toastPosition: e.target.value as ToastPosition })}
					/>
				))}
			</Field>
		)}
		<Field label='Dismissible'>
			<Toggle checked={state.dismissible} onChange={(e) => dispatch({ dismissible: e.target.checked })} />
		</Field>
		<Field label='Icon'>
			<Select value={state.icon ?? ''} onChange={(e) => dispatch({ icon: e.target.value as keyof typeof Lu })}>
				<option value=''>None</option>
				{R.keys(Lu).map((x) => (
					<option key={x} value={x}>
						{x.slice(2)}
					</option>
				))}
			</Select>
		</Field>
		<Field label='Has action'>
			<Toggle checked={state.hasAction} onChange={(e) => dispatch({ hasAction: e.target.checked })} />
		</Field>
		{state.hasAction && (
			<Field label='Action Label'>
				<Input value={state.actionLabel} onChange={(e) => dispatch({ actionLabel: e.target.value })} />
			</Field>
		)}
		<Field label='Has Cancel'>
			<Toggle checked={state.hasCancel} onChange={(e) => dispatch({ hasCancel: e.target.checked })} />
		</Field>
		{state.hasCancel && (
			<Field label='Cancel label'>
				<Input value={state.cancelLabel} onChange={(e) => dispatch({ cancelLabel: e.target.value })} />
			</Field>
		)}
	</Fieldset>
)

export const Default: StoryObj = {
	name: 'Toaster',
	render: () => {
		const [state, dispatch] = useReducer((s: ToastState, a: ToastAction) => ({ ...s, ...a }), initialState)

		const selectedIcon = state.icon ? Lu[state.icon]({}) : null

		const data = {
			duration: state.useInfiniteDuration ? Infinity : state.duration,
			dismissible: state.dismissible,
			...(state.overridePosition ? { position: state.toastPosition } : undefined),
			...(state.hasDescription && { description: state.description }),
			...(state.showCloseButton !== undefined && { closeButton: state.showCloseButton }),
			...(state.hasAction && {
				action: {
					label: state.actionLabel,
					onClick: () => toast('Action clicked'),
				},
			}),
			...(state.hasCancel && {
				cancel: {
					label: state.cancelLabel,
					onClick: () => toast('Cancel clicked'),
				},
			}),
		} satisfies ExternalToast

		const triggerSuccess = () => toast.success(state.title, data)
		const triggerError = () => toast.error(state.title, data)
		const triggerWarning = () => toast.warning(state.title, data)
		const triggerInfo = () => toast.info(state.title, data)
		const triggerDefault = () => toast(state.title, { ...data, icon: selectedIcon })

		const triggerLoading = (resolve: 'error' | 'success') => {
			const id = toast.loading('Loading...')
			setTimeout(() => {
				if (resolve === 'success') toast.success('Done!', { id })
				else toast.error('Oops!', { id })
			}, 1000)
		}

		const triggerCustom = () =>
			toast.custom(
				(t) => (
					<div className='prose text-center' onClick={() => toast.dismiss(t)}>
						<h3>{state.title}</h3>
						<p>Click anywhere to dismiss.</p>
					</div>
				),
				{ duration: Infinity, className: 'glass w-full block cursor-pointer' },
			)

		return (
			<div className='demo *:max-w-sm *:w-full'>
				<GlobalSettings state={state} dispatch={dispatch} />
				<ColorButton className='btn' onClick={() => toast.dismiss()}>
					Dismiss All
				</ColorButton>
				<div className='flex flex-wrap justify-center gap-2'>
					<Button className='btn-success' onClick={triggerSuccess}>
						Success
					</Button>
					<Button className='btn-error' onClick={triggerError}>
						Error
					</Button>
					<Button className='btn-warning' onClick={triggerWarning}>
						Warning
					</Button>
					<Button className='btn-info' onClick={triggerInfo}>
						Info
					</Button>
					<Button onClick={triggerDefault}>Default</Button>
					<Button onClick={() => triggerLoading('success')}>Loading ✅</Button>
					<Button onClick={() => triggerLoading('error')}>Loading ❌</Button>
					<Button onClick={triggerCustom}>Custom</Button>
				</div>
				<ToastSettings state={state} dispatch={dispatch} />
				<Toaster
					expand={state.expand}
					closeButton={state.closeButton}
					position={state.position}
					visibleToasts={state.visibleToasts}
				/>
			</div>
		)
	},
}

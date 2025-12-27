import { useDuration } from '@/hooks'
import type { DurationUnit } from '@/utils'
import { durationUnitMap, durationUnits, randomDate, toDateTimeLocal } from '@/utils'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment, useState } from 'react'
import { CountdownBox } from './story.utils'

const meta = { title: 'hooks/useDuration' } satisfies Meta
export default meta

const durationUnitsSubset = durationUnits.filter((x) => x !== 'milliseconds')

export const UseDuration: StoryObj = {
	name: 'useDuration',
	render: () => {
		const [targetDate, setTargetDate] = useState<Date>(() => new Date(Date.now() + 1000 * 15))
		const [selectedUnits, setSelectedUnits] = useState<DurationUnit[]>(['days', 'hours', 'minutes', 'seconds'])

		const duration = useDuration({ targetDate, units: selectedUnits })

		const toggleUnit = (unit: DurationUnit) =>
			setSelectedUnits((prev) => (prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]))

		const adjustByUnit = (unit: DurationUnit, amount: number) => {
			const { add } = durationUnitMap[unit as keyof typeof durationUnitMap]
			setTargetDate((d) => add(d, amount))
		}

		return (
			<div className='demo'>
				<div className='flex gap-2'>
					{durationUnitsSubset
						.filter((u) => selectedUnits.includes(u))
						.map((unit) => (
							<CountdownBox key={unit} label={unit} value={duration[unit]} />
						))}
				</div>

				<div className='flex items-center gap-2'>
					<span>{targetDate > new Date() ? 'until' : 'since'}</span>
					<input
						className='input'
						type='datetime-local'
						value={toDateTimeLocal(targetDate)}
						onChange={(e) => {
							if (!e.target.value) return
							setTargetDate(new Date(e.target.value))
						}}
					/>
					<button className='btn btn-sm' type='button' onClick={() => setTargetDate(new Date())}>
						Now
					</button>
					<button className='btn btn-sm' type='button' onClick={() => setTargetDate(randomDate())}>
						Random
					</button>
				</div>

				<div className='grid gap-2 gap-y-8 place-items-center grid-flow-col grid-rows-3'>
					{durationUnitsSubset.map((unit) => (
						<Fragment key={unit}>
							<button className='btn' type='button' onClick={() => adjustByUnit(unit, 1)}>
								+1{unit.slice(0, 1)}
							</button>
							<label className='label flex-col cursor-pointer gap-2'>
								<input
									checked={selectedUnits.includes(unit)}
									className='checkbox checkbox-xs'
									type='checkbox'
									onChange={() => toggleUnit(unit)}
								/>
								<span>{unit}</span>
							</label>
							<button className='btn' type='button' onClick={() => adjustByUnit(unit, -1)}>
								-1{unit.slice(0, 1)}
							</button>
						</Fragment>
					))}
				</div>
			</div>
		)
	},
}

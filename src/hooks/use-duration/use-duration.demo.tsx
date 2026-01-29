import { AnimatedNumber } from '@/components'
import { useDuration } from '@/hooks'
import type { DurationUnit } from '@/utils'
import { durationUnitMap, randomDate, toDateTimeLocal } from '@/utils'
import type { DemoMeta } from '@demo'
import { durationUnitsWithoutMs } from '@demo'
import { Fragment, useState } from 'react'

export const meta: DemoMeta = { title: 'useDuration', category: 'hooks' }

export function Demo() {
	const [targetDate, setTargetDate] = useState<Date>(() => new Date(Date.now() + 1000 * 15))
	const [selectedUnits, setSelectedUnits] = useState<DurationUnit[]>(['days', 'hours', 'minutes', 'seconds'])

	const duration = useDuration({ targetDate, units: selectedUnits })

	const toggleUnit = (unit: DurationUnit) =>
		setSelectedUnits((prev) => (prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]))

	const adjustByUnit = (unit: DurationUnit, amount: number) =>
		setTargetDate((d) => durationUnitMap[unit].add(d, amount))

	return (
		<div className='demo'>
			<div className='flex gap-2'>
				{durationUnitsWithoutMs
					.filter((u) => selectedUnits.includes(u))
					.map((unit) => (
						<div key={unit} className='alert'>
							<AnimatedNumber className='text-5xl' value={duration[unit]} />
							<span className='text-center'>{unit}</span>
						</div>
					))}
			</div>

			<div className='flex items-center gap-2'>
				<span>{targetDate > new Date() ? 'until' : 'since'}</span>
				<input
					className='input'
					type='datetime-local'
					value={toDateTimeLocal(targetDate)}
					onChange={(e) => e.target.value && setTargetDate(new Date(e.target.value))}
				/>
				<button className='btn' type='button' onClick={() => setTargetDate(new Date())}>
					Now
				</button>
				<button className='btn' type='button' onClick={() => setTargetDate(randomDate())}>
					Random
				</button>
			</div>

			<div className='grid gap-2 gap-y-8 place-items-center grid-flow-col grid-rows-3'>
				{durationUnitsWithoutMs.map((unit) => (
					<Fragment key={unit}>
						<button className='btn' type='button' onClick={() => adjustByUnit(unit, 1)}>
							+1{unit.slice(0, 1)}
						</button>
						<label className='label flex-col cursor-pointer gap-2'>
							<input
								checked={selectedUnits.includes(unit)}
								className='checkbox'
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
}

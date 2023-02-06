import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { useEffect } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
  date: Date
}

export function HabitsList({ date } : HabitsListProps) {
  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString()
      }
    }).then(response => {
      console.log(response.data)
    })
  }, [])

  return (
    <div className='mt-6 flex-col gap-3'>
      <Checkbox.Root className='flex items-center gap-3 group'>
        <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-800 border-2 border-zinc-700 group-data-[state=checked]:bg-green-600 group-data-[state=checked]:border-green-500'>
          <Checkbox.Indicator>
            <Check size={25} className='text-white'/>
          </Checkbox.Indicator>
        </div>

        <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
          Beber 2L de água.
        </span>
      </Checkbox.Root>
    </div>
  )
}
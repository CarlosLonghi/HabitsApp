import { FastifyInstance } from "fastify"
import { prisma } from "./lib/prisma"
import dayjs from "dayjs"
import { z } from "zod"

export async function appRoutes(app: FastifyInstance) {

  // Create Habits
  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      ),
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            }
          }),
        }
      }
    })
  })

  // Reader Possible Habits
  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    })

    // Searching Habits completed
    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    })

    // Validation if day is null
    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    }) ?? []

    return {
      possibleHabits,
      completedHabits
    }
  })

  // Complete and remove habit status in days
  app.patch('/habits/:id/toggle', async (request) => {
    // route param => Parâmetro de identificação. 
    
    const toggleHabitParams = z.object({
      id: z.string().uuid()
    }) 

    const { id } = toggleHabitParams.parse(request.params)
    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })

    if(!day) {
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    })  

    if(dayHabit) {
      // remove complete habit notation
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })

    } else {
      // add complete habit notation
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id
        }
      })
    }
  })

  // Reader Summary Habits
  app.get('/summary', async () => {
    // Query mais complexa, mais condições e relacionamentos => SQL na mão (RAW)
    // RAW SQL => SQLite

    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H 
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int) 
            AND H.created_at <= D.date
        ) as amount
      FROM days D 
    `
    return summary
  })
}

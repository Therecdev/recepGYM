"use client"

import type React from "react"
import { useMemo } from "react"
import { View, StyleSheet } from "react-native"
import { BarChart } from "react-native-chart-kit"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import { useWorkoutStore } from "../../stores/workoutStore"
import { getDaysInMonth, getWeekDays, getMonthsInYear } from "../../utils/dateUtils"

interface WorkoutFrequencyChartProps {
  timeframe: string
  style?: object
}

export const WorkoutFrequencyChart: React.FC<WorkoutFrequencyChartProps> = ({ timeframe, style }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const completedWorkouts = useWorkoutStore((state) => state.completedWorkouts)

  const chartData = useMemo(() => {
    const now = new Date()
    let labels: string[] = []
    let data: number[] = []

    if (timeframe === "week") {
      // Get days of the week
      labels = getWeekDays(t).map((day) => day.substring(0, 3))

      // Count workouts for each day of the current week
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())

      data = Array(7).fill(0)

      completedWorkouts.forEach((workout) => {
        const workoutDate = new Date(workout.date)
        if (workoutDate >= startOfWeek && workoutDate <= now) {
          const dayOfWeek = workoutDate.getDay()
          data[dayOfWeek]++
        }
      })
    } else if (timeframe === "month") {
      // Get days of the month
      const daysInMonth = getDaysInMonth(now.getMonth(), now.getFullYear())
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())

      // Count workouts for each day of the current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      data = Array(daysInMonth).fill(0)

      completedWorkouts.forEach((workout) => {
        const workoutDate = new Date(workout.date)
        if (workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear()) {
          const dayOfMonth = workoutDate.getDate() - 1
          data[dayOfMonth]++
        }
      })

      // For month view, only show every 5th day label to avoid crowding
      labels = labels.map((label, i) => (i % 5 === 0 ? label : ""))
    } else if (timeframe === "year") {
      // Get months of the year
      labels = getMonthsInYear(t).map((month) => month.substring(0, 3))

      // Count workouts for each month of the current year
      data = Array(12).fill(0)

      completedWorkouts.forEach((workout) => {
        const workoutDate = new Date(workout.date)
        if (workoutDate.getFullYear() === now.getFullYear()) {
          const month = workoutDate.getMonth()
          data[month]++
        }
      })
    } else if (timeframe === "all") {
      // Group by year
      const workoutsByYear = completedWorkouts.reduce(
        (acc, workout) => {
          const year = new Date(workout.date).getFullYear()
          if (!acc[year]) {
            acc[year] = 0
          }
          acc[year]++
          return acc
        },
        {} as Record<number, number>,
      )

      // Sort years
      const years = Object.keys(workoutsByYear).sort()

      labels = years
      data = years.map((year) => workoutsByYear[Number.parseInt(year)])
    }

    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    }
  }, [timeframe, completedWorkouts, t])

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    color: () => theme.colors.primary,
    labelColor: () => theme.colors.text,
    barPercentage: 0.7,
    decimalPlaces: 0,
  }

  return (
    <View style={[styles.container, style]}>
      <BarChart
        data={chartData}
        width={300}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero
        showValuesOnTopOfBars
        withInnerLines={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    borderRadius: 16,
  },
})


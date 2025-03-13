"use client"

import type React from "react"
import { useMemo } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { ScatterChart } from "react-native-chart-kit"
import type { SleepData, StressData } from "../../types/health"
import type { Workout } from "../../types/workout"
import { useTheme } from "../../hooks/useTheme"
import { useTranslation } from "react-i18next"

interface CorrelationChartProps {
  metric: string
  sleepData: SleepData[]
  stressData: StressData[]
  workouts: Workout[]
  style?: any
}

export const CorrelationChart: React.FC<CorrelationChartProps> = ({
  metric,
  sleepData,
  stressData,
  workouts,
  style,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  // Generate correlation data points
  const dataPoints = useMemo(() => {
    // Map workouts to their dates for easier lookup
    const workoutMap = new Map()
    workouts.forEach((workout) => {
      if (workout.completedAt) {
        const date = new Date(workout.completedAt).toDateString()

        // Calculate a performance score (0-100) based on workout data
        // This is a simplified example - in a real app, you'd use more sophisticated metrics
        const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
        const completedSets = workout.exercises.reduce(
          (sum, ex) => sum + ex.sets.filter((set) => set.completed).length,
          0,
        )

        const performanceScore = totalSets > 0 ? (completedSets / totalSets) * 100 : 0

        workoutMap.set(date, {
          ...workout,
          performanceScore,
        })
      }
    })

    const points = []

    if (metric === "sleep") {
      // Correlate sleep quality with workout performance
      sleepData.forEach((sleep) => {
        const sleepDate = new Date(sleep.startTime)
        const nextDay = new Date(sleepDate)
        nextDay.setDate(nextDay.getDate() + 1)

        const workoutData = workoutMap.get(nextDay.toDateString())
        if (workoutData) {
          points.push({
            x: sleep.quality, // Sleep quality (0-100)
            y: workoutData.performanceScore, // Workout performance (0-100  // Sleep quality (0-100)
            y: workoutData.performanceScore, // Workout performance (0-100)
          })
        }
      })
    } else if (metric === "stress") {
      // Correlate stress level with workout performance
      stressData.forEach((stress) => {
        const stressDate = new Date(stress.date)
        const workoutData = workoutMap.get(stressDate.toDateString())

        if (workoutData) {
          points.push({
            x: stress.level, // Stress level (0-100)
            y: workoutData.performanceScore, // Workout performance (0-100)
          })
        }
      })
    } else if (metric === "recovery") {
      // For recovery, we'll use a combination of sleep quality and inverse stress level
      // This is a simplified example - in a real app, you'd use more sophisticated recovery metrics
      const dateMap = new Map()

      // Collect sleep data by date
      sleepData.forEach((sleep) => {
        const date = new Date(sleep.startTime).toDateString()
        if (!dateMap.has(date)) {
          dateMap.set(date, { sleep: sleep.quality, stress: null })
        } else {
          const entry = dateMap.get(date)
          dateMap.set(date, { ...entry, sleep: sleep.quality })
        }
      })

      // Collect stress data by date
      stressData.forEach((stress) => {
        const date = new Date(stress.date).toDateString()
        if (!dateMap.has(date)) {
          dateMap.set(date, { sleep: null, stress: stress.level })
        } else {
          const entry = dateMap.get(date)
          dateMap.set(date, { ...entry, stress: stress.level })
        }
      })

      // Calculate recovery score and correlate with workout performance
      dateMap.forEach((data, dateStr) => {
        const nextDay = new Date(dateStr)
        nextDay.setDate(nextDay.getDate() + 1)

        const workoutData = workoutMap.get(nextDay.toDateString())
        if (workoutData && data.sleep !== null) {
          // Calculate recovery score (0-100)
          // Higher sleep quality and lower stress = better recovery
          const stressComponent = data.stress !== null ? (100 - data.stress) * 0.3 : 30
          const sleepComponent = data.sleep * 0.7
          const recoveryScore = stressComponent + sleepComponent

          points.push({
            x: recoveryScore, // Recovery score (0-100)
            y: workoutData.performanceScore, // Workout performance (0-100)
          })
        }
      })
    }

    return points
  }, [metric, sleepData, stressData, workouts])

  // Calculate correlation coefficient
  const calculateCorrelation = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return 0

    const n = points.length
    const sumX = points.reduce((sum, point) => sum + point.x, 0)
    const sumY = points.reduce((sum, point) => sum + point.y, 0)
    const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0)
    const sumXSquare = points.reduce((sum, point) => sum + point.x * point.x, 0)
    const sumYSquare = points.reduce((sum, point) => sum + point.y * point.y, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXSquare - sumX * sumX) * (n * sumYSquare - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  }

  const correlation = calculateCorrelation(dataPoints)
  const correlationStrength = Math.abs(correlation)

  // Get labels for X and Y axes
  const getAxisLabels = () => {
    if (metric === "sleep") {
      return {
        x: t("wellness.metrics.sleepQuality"),
        y: t("wellness.metrics.workoutPerformance"),
      }
    } else if (metric === "stress") {
      return {
        x: t("wellness.metrics.stressLevel"),
        y: t("wellness.metrics.workoutPerformance"),
      }
    } else {
      return {
        x: t("wellness.metrics.recoveryScore"),
        y: t("wellness.metrics.workoutPerformance"),
      }
    }
  }

  const axisLabels = getAxisLabels()

  // Format data for the chart
  const chartData = {
    datasets: [
      {
        data: dataPoints,
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
    legend: [`${axisLabels.x} vs ${axisLabels.y}`],
  }

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: theme.colors.background,
    },
  }

  const screenWidth = Dimensions.get("window").width - 40 // Padding

  // Get correlation description
  const getCorrelationDescription = () => {
    if (correlationStrength < 0.3) {
      return t("analytics.correlation.weak")
    } else if (correlationStrength < 0.7) {
      return t("analytics.correlation.moderate")
    } else {
      return t("analytics.correlation.strong")
    }
  }

  // Get correlation direction
  const getCorrelationDirection = () => {
    if (correlation > 0.1) {
      return t("analytics.correlation.positive")
    } else if (correlation < -0.1) {
      return t("analytics.correlation.negative")
    } else {
      return t("analytics.correlation.none")
    }
  }

  return (
    <View style={[styles.container, style]}>
      {dataPoints.length > 1 ? (
        <>
          <ScatterChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            xAxisLabel=""
          />

          <View style={styles.correlationContainer}>
            <Text style={[styles.correlationLabel, { color: theme.colors.textSecondary }]}>
              {t("analytics.correlation.coefficient")}:
            </Text>
            <Text
              style={[
                styles.correlationValue,
                {
                  color:
                    correlationStrength < 0.3
                      ? theme.colors.textSecondary
                      : correlation > 0
                        ? theme.colors.success
                        : theme.colors.error,
                },
              ]}
            >
              {correlation.toFixed(2)}
            </Text>
            <Text style={[styles.correlationDescription, { color: theme.colors.text }]}>
              ({getCorrelationDescription()} {getCorrelationDirection()})
            </Text>
          </View>

          <View style={styles.axisLabelsContainer}>
            <Text style={[styles.axisLabel, { color: theme.colors.textSecondary }]}>{axisLabels.x}</Text>
            <Text style={[styles.axisLabel, { color: theme.colors.textSecondary }]}>{axisLabels.y}</Text>
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>{t("analytics.notEnoughData")}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  chart: {
    borderRadius: 8,
    marginBottom: 10,
  },
  correlationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  correlationLabel: {
    fontSize: 14,
    marginRight: 5,
  },
  correlationValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  correlationDescription: {
    fontSize: 14,
  },
  axisLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  axisLabel: {
    fontSize: 12,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
  },
})


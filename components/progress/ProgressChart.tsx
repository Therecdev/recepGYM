"use client"

import type React from "react"
import { useMemo } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTranslation } from "react-i18next"
import { useTheme } from "../../hooks/useTheme"
import type { WorkoutHistory } from "../../types/workout"
import { calculateOneRepMax, calculateVolume } from "../../utils/progressionUtils"
import { formatDate } from "../../utils/dateUtils"

interface ProgressChartProps {
  exerciseHistory: WorkoutHistory[]
  exerciseId: string
  metric: "weight" | "volume" | "oneRepMax"
  timeframe: "week" | "month" | "year" | "all"
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ exerciseHistory, exerciseId, metric, timeframe }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  // Filter and prepare data based on timeframe
  const filteredData = useMemo(() => {
    if (!exerciseHistory || exerciseHistory.length === 0) return []

    // Sort history by date
    const sortedHistory = [...exerciseHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Filter by timeframe
    const now = new Date()
    let filteredHistory = sortedHistory

    if (timeframe === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredHistory = sortedHistory.filter((history) => new Date(history.date) >= oneWeekAgo)
    } else if (timeframe === "month") {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      filteredHistory = sortedHistory.filter((history) => new Date(history.date) >= oneMonthAgo)
    } else if (timeframe === "year") {
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      filteredHistory = sortedHistory.filter((history) => new Date(history.date) >= oneYearAgo)
    }

    // Filter to only include workouts with the selected exercise
    return filteredHistory.filter((history) => history.exercises.some((exercise) => exercise.id === exerciseId))
  }, [exerciseHistory, exerciseId, timeframe])

  // Extract data points based on selected metric
  const chartData = useMemo(() => {
    if (filteredData.length === 0) return { labels: [], datasets: [{ data: [] }] }

    const labels: string[] = []
    const data: number[] = []

    filteredData.forEach((history) => {
      const exercise = history.exercises.find((ex) => ex.id === exerciseId)
      if (!exercise) return

      let value = 0

      switch (metric) {
        case "weight":
          // Use the heaviest weight used
          value = Math.max(...exercise.sets.map((set) => set.weight || 0))
          break
        case "volume":
          // Calculate total volume
          value = calculateVolume(exercise.sets)
          break
        case "oneRepMax":
          // Calculate estimated 1RM from best set
          const bestSet = [...exercise.sets].sort(
            (a, b) => calculateOneRepMax(b.weight, b.reps) - calculateOneRepMax(a.weight, a.reps),
          )[0]

          value = bestSet ? calculateOneRepMax(bestSet.weight, bestSet.reps) : 0
          break
      }

      if (value > 0) {
        labels.push(formatDate(new Date(history.date), "short"))
        data.push(value)
      }
    })

    return {
      labels,
      datasets: [{ data }],
    }
  }, [filteredData, exerciseId, metric])

  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.datasets[0].data.length < 2) return "neutral"

    const firstValue = chartData.datasets[0].data[0]
    const lastValue = chartData.datasets[0].data[chartData.datasets[0].data.length - 1]

    if (lastValue > firstValue) {
      return "positive"
    } else if (lastValue < firstValue) {
      return "negative"
    } else {
      return "neutral"
    }
  }, [chartData])

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (chartData.datasets[0].data.length < 2) return 0

    const firstValue = chartData.datasets[0].data[0]
    const lastValue = chartData.datasets[0].data[chartData.datasets[0].data.length - 1]

    if (firstValue === 0) return 0

    return ((lastValue - firstValue) / firstValue) * 100
  }, [chartData])

  // Get trend color
  const getTrendColor = () => {
    switch (trend) {
      case "positive":
        return theme.colors.success
      case "negative":
        return theme.colors.error
      default:
        return theme.colors.textSecondary
    }
  }

  // Get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case "positive":
        return "↑"
      case "negative":
        return "↓"
      default:
        return "→"
    }
  }

  // Get metric label
  const getMetricLabel = () => {
    switch (metric) {
      case "weight":
        return t("progress.weight")
      case "volume":
        return t("progress.volume")
      case "oneRepMax":
        return t("progress.oneRepMax")
      default:
        return ""
    }
  }

  if (chartData.datasets[0].data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.border + "30" }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {t("progress.noDataForTimeframe")}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.card,
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          decimalPlaces: 0,
          color: (opacity = 1) => theme.colors.primary,
          labelColor: (opacity = 1) => theme.colors.textSecondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: theme.colors.primary,
          },
        }}
        bezier
        style={styles.chart}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("progress.metric")}</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{getMetricLabel()}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("progress.trend")}</Text>
          <Text style={[styles.statValue, { color: getTrendColor() }]}>
            {getTrendIcon()} {Math.abs(percentageChange).toFixed(1)}%
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t("progress.current")}</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {Math.round(chartData.datasets[0].data[chartData.datasets[0].data.length - 1])}
            {metric === "weight" || metric === "oneRepMax" ? ` ${t("progress.kg")}` : ""}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  emptyContainer: {
    height: 220,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
})


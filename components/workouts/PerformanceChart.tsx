import type React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { useTheme } from "../../hooks/useTheme"
import type { Exercise } from "../../types/workout"
import { BarChart } from "react-native-chart-kit"

interface PerformanceChartProps {
  exercises: Exercise[]
  previousExercises?: Exercise[] | null
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ exercises, previousExercises }) => {
  const { theme } = useTheme()

  // Calculate volume for each exercise
  const calculateVolume = (exercise: Exercise): number => {
    return exercise.sets.reduce((total, set) => {
      return total + (set.weight || 0) * (set.reps || 0)
    }, 0)
  }

  // Prepare data for chart
  const prepareChartData = () => {
    // Sort exercises by volume (descending)
    const sortedExercises = [...exercises].sort((a, b) => calculateVolume(b) - calculateVolume(a))

    // Take top 5 exercises by volume
    const topExercises = sortedExercises.slice(0, 5)

    // Prepare labels and data
    const labels = topExercises.map((exercise) => {
      // Shorten exercise name if too long
      const name = exercise.name
      return name.length > 10 ? name.substring(0, 10) + "..." : name
    })

    // Current workout data
    const currentData = topExercises.map((exercise) => calculateVolume(exercise))

    // Previous workout data (if available)
    const previousData = topExercises.map((exercise) => {
      if (!previousExercises) return 0

      const prevExercise = previousExercises.find((e) => e.id === exercise.id)
      return prevExercise ? calculateVolume(prevExercise) : 0
    })

    // Check if we have previous data
    const hasPreviousData = previousData.some((value) => value > 0)

    return {
      labels,
      datasets: [
        {
          data: currentData,
          color: (opacity = 1) => theme.colors.primary + (opacity * 255).toString(16).padStart(2, "0"),
          strokeWidth: 2,
        },
        ...(hasPreviousData
          ? [
              {
                data: previousData,
                color: (opacity = 1) => theme.colors.textSecondary + (opacity * 255).toString(16).padStart(2, "0"),
                strokeWidth: 2,
              },
            ]
          : []),
      ],
      legend: hasPreviousData ? ["Current", "Previous"] : ["Current"],
    }
  }

  // If no exercises, return empty view
  if (exercises.length === 0) {
    return null
  }

  const chartData = prepareChartData()

  // If all volumes are 0, don't show chart
  if (chartData.datasets[0].data.every((value) => value === 0)) {
    return null
  }

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 70}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundColor: theme.colors.card,
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          decimalPlaces: 0,
          color: (opacity = 1) => theme.colors.text + (opacity * 255).toString(16).padStart(2, "0"),
          labelColor: (opacity = 1) => theme.colors.textSecondary + (opacity * 255).toString(16).padStart(2, "0"),
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.7,
        }}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
      />

      {chartData.datasets.length > 1 && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.legendText, { color: theme.colors.text }]}>Current</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.textSecondary }]} />
            <Text style={[styles.legendText, { color: theme.colors.text }]}>Previous</Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
})

